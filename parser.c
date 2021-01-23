#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "parser.h"


typedef enum {
              T_KEYWORD,
              T_NUMBER,
              T_VARIABLE,
              T_WORD
} TokenType;


typedef enum {
              K_ANGLE_LEFT,
              K_ANGLE_RIGHT,
              K_AND,
              K_OR,
              K_NOT,
              K_IF,
              K_REMOVES,
              K_DISPLAYS,
              K_CAUSES,
              K_CHOICE,
              K_AVAILABLE,
              K_WHEN,
              K_INITIAL,
              K_STATE,
              K_IS,
              K_ACTION,
              K_EARLY,
              K_WITH,
              K_PRIORITY,
              K_CURLY_LEFT,
              K_CURLY_RIGHT,
              K_SUCH,
              K_THAT,
              K_LEADS,
              K_TO,
              K_IN,
              K_END

} KeywordType;


struct token {
  TokenType token_type;
  Context context;
};


typedef struct {
  TokenType token_type;
  Context context;
  KeywordType keyword;
} Keyword;

typedef struct {
  TokenType token_type;
  Context context;
  int number;
  char * number_representation;
} Number;

typedef struct {
  TokenType token_type;
  Context context;
  char * variable;
} Variable;

typedef struct {
  TokenType token_type;
  Context context;
  char * word;
} Word;



const char * TOKEN_TYPES[] = {
                              "keyword",
                              "number",
                              "variable",
                              "word"
};


const char * KEYWORDS[] = {
                           "<",
                           ">",
                           "and",
                           "or",
                           "not",
                           "if",
                           "removes",
                           "displays",
                           "causes",
                           "Choice",
                           "available",
                           "when",
                           "Initial",
                           "state",
                           "is",
                           "Action",
                           "Early",
                           "with",
                           "priority",
                           "{",
                           "}",
                           "such",
                           "that",
                           "leads",
                           "to",
                           "In",
                           "End"
};

bool keyword_lookup(char * str, KeywordType * result){
  //todo: this cannot recognize partial matches,
  //when you have keywords that take more then one token
  unsigned int keyword_elements = sizeof(KEYWORDS) / sizeof(KEYWORDS[0]);
  for (KeywordType i = 0; i < keyword_elements; i++){
    if (strcmp(str, KEYWORDS[i]) == 0){
      *result = i;
      return true;
    }
  }
  return false;
}

void token_print(const Token* token){
  switch (token->token_type){
  case T_KEYWORD: {
    Keyword * k = (Keyword *) token;
    printf("<Keyword %s %i:%i>", KEYWORDS[k->keyword],
           k->context.line_number, k->context.column_number);
  }
    break;

  case T_NUMBER: {
    Number * n = (Number *) token;
    printf("<Number %s %i:%i>", n->number_representation,
           n->context.line_number, n->context.column_number);
  }
    break;
  case T_VARIABLE: {
    Variable * v = (Variable *) token;
    printf("<Variable %s %i:%i>", v->variable,
           v->context.line_number, v->context.column_number);
  }
    break;
  case T_WORD: {
    Word * w = (Word *) token;
    printf("<Word %s %i:%i>", w->word,
           w->context.line_number, w->context.column_number);
  }
    break;
  }
}


void token_print_whitespace(const Token* token){
  printf("<'%s'>", token->context.leading_whitespace);
}



KeywordType verb_type_to_keyword_type(VerbType vt){
  if (vt == L_AND)
    return K_AND;
  if (vt == L_OR)
    return K_OR;
  printf("Error: verb tag %i not assigned to any keyword\n", vt);
  exit(1);
}

void sentence_print (Sentence * sentence){
  if (sentence->name == NULL){
    VariableSentence * var = (VariableSentence *) sentence;
    printf("?%s(%i)", var->variable_name, var->variable_id);
  } else {
    
    printf("%s(", sentence->name);
    for (int i = 0; i < sentence->elements_length; i++){
      sentence_print(sentence->elements+i);
      if (i != (sentence->elements_length)-1)
        printf(",");
    }
    printf(")");
  }
}

//note-this is leaking whitespace
//not urgent right now, but if I care about rebuilding file from syntax tree
//I will need to get it fixed sooner or later

void logic_verb_print(LogicVerb * lv){
  if (lv->type == L_SENTENCE)
    sentence_print(lv->contents.basic);
  else {
    printf("%s(", KEYWORDS[verb_type_to_keyword_type(lv->type)]);
    for (int i = 0; i < lv->contents.nested->contents_length; i++){
      logic_verb_print(lv->contents.nested->contents + i);
      if (i != (lv->contents.nested->contents_length - 1)){
        printf(",");
      }
    }
    printf(")");
  }
  
}






void clause_print(Clause * cl) {
  sentence_print(cl->head);
  if (cl->body != NULL){
    printf(":-");
    logic_verb_print(cl->body);
  }
}





//globals
char * file;
Token ** tokens;

unsigned long oracle_current = 0;
OracleItem * oracle_base = NULL;
long oracle_capacity = 0;


//memory allocation
unsigned long arena_current = 0;
char * arena_base = NULL;
unsigned long arena_capacity = 0;

void * arenalloc(size_t size){
  if (!arena_base){
    printf("Arena allocator not initialized!\n");
    exit(1);
  }
  if ((arena_current+size) >= arena_capacity){
    printf("Memory exhausted!\n");
    printf("Needed size: %lu \nCurrent size: %li \n", arena_current+size, arena_capacity);
    exit(1);
  }
  void * newpointer = arena_base + arena_current;
  arena_current += size;
  return newpointer;
}

void globals_free(){
   free(file);
   free(arena_base);
   free(oracle_base);
   free(tokens);
}


bool is_whitespace(char ch){
  return ch == ' ' || ch == '\f' || ch == '\n' || ch == '\r' || ch == '\t' || ch == 0;
}

bool is_break_token(char ch){
  return
    ch == '<' ||
    ch == '>' ||
    ch == '}' ||
    ch == '{' ||
    ch == '|' ||
    ch == ',' ||
    ch == '.' ||
    ch == ';' ||
    ch == '(' ||
    ch == ')';
}

void tokenize(char* filename, char * file, long fsize, Token*** tokens, int * tokens_size){
  char * buffer = arena_base + arena_current;

  *tokens = malloc(sizeof(Token*) * 10);
  *tokens_size = 0;
  int tokens_capacity = 10;

  int line_counter = 1;
  int column_counter = 0;

  Context * token_context = NULL;

  bool output_token = false;
  bool reset_loop = false;

  int comment_level = 0;

for (int i = 0; i < fsize+1; i++) {
  char current_char = file[i];

  if (current_char == '(' && file[i+1] == '*'){
    comment_level++;
    i++; //to skip star
  }
  
  if (!comment_level) {
    if (token_context != NULL){
      if (is_whitespace(current_char)){
        //printf("Context present, whitespace\n");
        *(char *)(arenalloc(sizeof(char))) = '\0';
        output_token = true;                                                     
        reset_loop = true;
      }
      else if (is_break_token(current_char)){
        //printf("Context present, break token\n");
        *(char *)(arenalloc(sizeof(char))) = '\0';
        output_token = true;
        reset_loop = true;
      }
      else {
        //printf("Context present, no whitespace\n");
        *(char *)(arenalloc(sizeof(char))) = current_char;
      }
    }else{
      if (is_whitespace(current_char)){
        //printf("Context not present, whitespace\n");
        *(char *)(arenalloc(sizeof(char))) = current_char;
    
      } else if (is_break_token(current_char)){
        //printf("Context not present, break token\n");
        *(char *)(arenalloc(sizeof(char))) = '\0';             
        token_context = arenalloc(sizeof(Context));            
        token_context->leading_whitespace = buffer;            
        buffer = arena_base + arena_current;                   
        token_context->line_number = line_counter;             
        token_context->column_number = column_counter;
        token_context->file_name = filename;
      
        *(char *)(arenalloc(sizeof(char))) = current_char;
        *(char *)(arenalloc(sizeof(char))) = '\0';

        output_token = true;                                               
    
      }else {
        //printf("Context not present, no whitespace\n");
      
        *(char *)(arenalloc(sizeof(char))) = '\0';             
        token_context = arenalloc(sizeof(Context));            
        token_context->leading_whitespace = buffer;            
        buffer = arena_base + arena_current;                   
        token_context->line_number = line_counter;             
        token_context->column_number = column_counter;         
        token_context->file_name = filename;

        reset_loop = true;
     
      }

    
    }


    if (output_token) {

      Token * token = NULL;                                               
      int parsed_int;                                                     
      KeywordType kwt;                                                    
                                                                        
      if (buffer[0] == '?'){                                              
        Variable * var = arenalloc(sizeof(Variable));                     
        var->token_type = T_VARIABLE;                                     
        var->context = *token_context;                                    
        var->variable = buffer + 1;                                       
        token = (Token*) var;                                                      
                                                                        
      } else if ((parsed_int = atoi(buffer)) || buffer[0] == '0'){       
        Number * num = arenalloc(sizeof(Number));                         
        num->token_type = T_NUMBER;                                       
        num->context = *token_context;                                    
        num->number = parsed_int;                                         
        num->number_representation = buffer;
        token = (Token*) num;                                                      
                                                                        
      } else if (keyword_lookup(buffer, &kwt)){                   
        Keyword * key = arenalloc(sizeof(Keyword));                       
        key->token_type = T_KEYWORD;                                      
        key->context = *token_context;                                    
        key->keyword = kwt;                                               
        token = (Token*) key;                                                      
                                                                        
      } else {                                                            
        Word * word = arenalloc(sizeof(Word));                            
        word->token_type = T_WORD;                                        
        word->context = *token_context;                                   
        word->word = buffer;                                              
        token = (Token*) word;                                                     
                                                                        
                                                                        
      }                                                                   
      buffer = arena_base + arena_current;                                
      if (*tokens_size >= tokens_capacity){                                
        tokens_capacity *= 2;                                             
        *tokens = realloc(*tokens, tokens_capacity * sizeof(Token*));       
      }                                                                   
      (*tokens)[*tokens_size] = token;                                        
      (*tokens_size)++;                                                      
      token_context = NULL;                                               


      output_token = false;
    }


  
    if (current_char == '\n'){
      line_counter++;
      column_counter = 0;
    } else
      column_counter++;

    if (reset_loop){
      i--;
      column_counter--;
      reset_loop = false;
    }
  
  } else {
    if (current_char == '*' && file[i+1] == ')') {
      comment_level--;
      i++; //to skip closing paren
    }
    
  }
 
 }


}


#include <assert.h>


void print_oracle_item(OracleItem * item){
  //TODO: make this display relevant elements
  switch(item->sentence.tag){
  case OI_SENTENCE:
    printf("[Sentence: %d chs, %d elems]", item->sentence.name_size, item->sentence.elements_size);
    break;
  case OI_LOGIC_VERB :
    printf("[Logic verb: variant %d, %d elems]", item->logic_verb.variant, item->logic_verb.elements_size);
    break;
  case OI_CLAUSE :
    printf("[Clause: variant %d]", item->clause.variant);
    break;
  
  case OI_ITEMS:
    printf("[Items: %d elems]", item->items.elements_size);
    break;

  case OI_PARAMETERS:
    printf("[Parameters]");
    break;

  case OI_ELEMENT:
    if (item->element.element_tag == E_EARLY_ACTION)
      printf("[Early action]");
    else if (item->element.element_tag == E_LATE_ACTION)
      printf("[Late action]");
    else if (item->element.element_tag == E_CHOICE)
      printf("[Choice]");
    else
      printf("[Invalid element]");
    break;

  case OI_INITIAL:
    printf("[Initial: %s]", item->initial.has_description ? "with description" : "no description");
    break;

  case OI_TOPLEVEL:
     if (item->toplevel.toplevel_tag == TP_CLAUSE)
      printf("[Toplevel clause]");
    else if (item->toplevel.toplevel_tag == TP_DECK_OPEN)
      printf("[Toplevel deck open]");
    else if (item->toplevel.toplevel_tag == TP_DECK_CLOSE)
      printf("[Toplevel deck close]");
     else if (item->toplevel.toplevel_tag == TP_INITIAL)
      printf("[Toplevel initial state]");
     else if (item->toplevel.toplevel_tag == TP_ELEMENT)
      printf("[Toplevel element]");
    else
      printf("[Invalid toplevel]");
    break;
  }
}
  


void sentence_parse(Sentence * output, Token** tokens, const int tokens_size, int * tokens_counter,
                          OracleItem * oracle, const int oracle_size, int * oracle_counter){
  (*oracle_counter)++;

  OISentence oracle_item = oracle[*oracle_counter].sentence;
  assert(oracle_item.tag == OI_SENTENCE);
  
  const int name_size = oracle_item.name_size;
  
  char* name = arenalloc(sizeof(char)*(name_size+1));
  int name_counter = 0;
  
  int elements_size = oracle_item.elements_size;
  Sentence * elements = arenalloc(sizeof(Sentence)*elements_size);
  int elements_counter = 0;

  Keyword * opening_bracket = (Keyword *) tokens[*tokens_counter];


  
  (*tokens_counter)++;
  while (!(tokens[*tokens_counter]->token_type == T_KEYWORD &&
           ((Keyword *)tokens[*tokens_counter])->keyword == K_ANGLE_RIGHT)){
    
    assert(name_counter < name_size+1);
    
    if (tokens[*tokens_counter]->token_type == T_WORD){
      
      
      Word * word = (Word *) tokens[*tokens_counter];
      int amount = strlen(word->context.leading_whitespace);
      
      strcpy(name+name_counter, word->context.leading_whitespace);
      name_counter += amount;
      
   
      amount = strlen(word->word);
 
      strcpy(name+name_counter, word->word);
      name_counter += amount;
      
      
    } else if (tokens[*tokens_counter]->token_type == T_NUMBER){
      
      Number * number = (Number *) tokens[*tokens_counter];
      int amount = strlen(number->context.leading_whitespace);
      strcpy(name+name_counter, number->context.leading_whitespace);
      name_counter += amount;

      amount = strlen(number->number_representation);
      strcpy(name+name_counter, number->number_representation);
      name_counter += amount;
   
      
    } else if (tokens[*tokens_counter]->token_type == T_KEYWORD  &&
         ((Keyword *)tokens[*tokens_counter])->keyword != K_ANGLE_LEFT){
      
      Keyword * keyword = (Keyword *) tokens[*tokens_counter];
      int amount = strlen(keyword->context.leading_whitespace);
      strcpy(name+name_counter, keyword->context.leading_whitespace);
      name_counter += amount;

      amount = strlen(KEYWORDS[keyword->keyword]);
      strcpy(name+name_counter, KEYWORDS[keyword->keyword]);
      name_counter += amount;
      
      
    } else if (tokens[*tokens_counter]->token_type == T_VARIABLE){
            
      Variable * variable = (Variable *) tokens[*tokens_counter];
      int amount = strlen(variable->context.leading_whitespace);
    
      strcpy(name+name_counter, variable->context.leading_whitespace);
    
      name_counter += amount;
      
      strcpy(name+name_counter, "{}");
      name_counter += 2;

      VariableSentence * var = (VariableSentence *) (elements + elements_counter);
      var->is_not_variable = (void *) NULL; //because it is a variable!
      var->variable_name = variable->variable;
      var->variable_id = 0;
      var->context = &variable->context;
      elements_counter++;
      

    } else if (tokens[*tokens_counter]->token_type == T_KEYWORD  &&
               ((Keyword *)tokens[*tokens_counter])->keyword == K_ANGLE_LEFT) {

      Keyword * keyword = (Keyword *) tokens[*tokens_counter];
      int amount = strlen(keyword->context.leading_whitespace);
      strcpy(name+name_counter, keyword->context.leading_whitespace);
      name_counter += amount;

      strcpy(name+name_counter, "{}");
      name_counter += 2;
      
      sentence_parse(elements + elements_counter, tokens, tokens_size, tokens_counter,
                     oracle, oracle_size, oracle_counter);
      elements_counter++;
    }
    
    (*tokens_counter)++;
  }

  
  output->name = name;
  output->context = &opening_bracket->context;
  output->elements = elements;
  output->elements_length = elements_size;

 
}


void sentence_oracle(Token** tokens, const int tokens_size, int * tokens_counter,
                       OracleItem * oracle, const int oracle_size, int * oracle_counter){

  assert(tokens[*tokens_counter]->token_type == T_KEYWORD && ((Keyword *)tokens[*tokens_counter])->keyword == K_ANGLE_LEFT);
  
  
  (*oracle_counter)++;
  OISentence * oracle_item = &(oracle_base + (*oracle_counter))->sentence;
  oracle_item->tag = OI_SENTENCE; 
  
  int *name_counter = &oracle_item->name_size;
  *name_counter = 0;

  int * item_counter = &oracle_item->elements_size;
  *item_counter = 0;

  Token * firsttoken = tokens[*tokens_counter];
  (*tokens_counter)++;

  for (int * i = tokens_counter; *i < tokens_size; (*i)++) {
    Token * token = tokens[*i];

    if (token->token_type == T_WORD) {
      Word * word = (Word *) token;
      *name_counter += strlen(word->context.leading_whitespace);
      *name_counter += strlen(word->word);
      continue;
    }

    if (token->token_type == T_NUMBER) {
      Number * num = (Number *) token;
      *name_counter += strlen(num->context.leading_whitespace);
      *name_counter += strlen(num->number_representation);
      continue;
    }

    if (token->token_type == T_KEYWORD
        && ((Keyword *)token)->keyword != K_ANGLE_LEFT
        && ((Keyword *)token)->keyword != K_ANGLE_RIGHT
        ) {
      Keyword * keyword = (Keyword *) token;
      *name_counter += strlen(keyword->context.leading_whitespace);
      *name_counter += strlen(KEYWORDS[keyword->keyword]);
      continue;
    }


    if (token->token_type == T_VARIABLE) {
      *name_counter += strlen(token->context.leading_whitespace);
      *name_counter += 2;
      (*item_counter)++;
       continue;
    }

    if (token->token_type == T_KEYWORD && ((Keyword *)token)->keyword == K_ANGLE_LEFT) {
      *name_counter += strlen(token->context.leading_whitespace);
      *name_counter += 2;
      (*item_counter)++;

      sentence_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
      continue;
    }

    if (token->token_type == T_KEYWORD && ((Keyword *)token)->keyword == K_ANGLE_RIGHT) {
      *name_counter += strlen(token->context.leading_whitespace);
            return;
    }

    printf("Syntax Error: wrong token type in sentence at %i:%i in %s\n", token->context.line_number, token->context.column_number, token->context.file_name);
    exit(1);
  }
  printf("Syntax Error: no matching bracket detected for sentence beginning at %i:%i in %s\n", firsttoken->context.line_number, firsttoken->context.column_number, firsttoken->context.file_name);
  exit(1);
}



void logic_verb_parse(LogicVerb * output, Token** tokens, const int tokens_size, int * tokens_counter,
                          OracleItem * oracle, const int oracle_size, int * oracle_counter){


  (*oracle_counter)++;
  OILogicVerb oracle_item = oracle[*oracle_counter].logic_verb;
  assert(oracle_item.tag == OI_LOGIC_VERB);
  

  switch (oracle_item.variant){
  case 1:{ //sentence
  
    
    Sentence * sent = arenalloc(sizeof(Sentence));
    sentence_parse(sent, tokens, tokens_size, tokens_counter,
                   oracle, oracle_size, oracle_counter);
    
    output->type = L_SENTENCE;
    output->contents.basic = sent;
    
  }
    break;
  case 2:{ //and
  
    Context * context = &(tokens[*tokens_counter]->context);
    
    
    
    int contents_length = oracle_item.elements_size;
    LogicVerb * contents = arenalloc(sizeof(LogicVerb) * contents_length);
    (*tokens_counter)++;
    for (int i = 0; i < contents_length; i++) {
 
      logic_verb_parse(contents+i, tokens, tokens_size, tokens_counter,
                   oracle, oracle_size, oracle_counter);
      (*tokens_counter)++;
      if (i != (contents_length-1))
        (*tokens_counter)++;
    }
    struct verb_nested * payload = arenalloc(sizeof(struct verb_nested));
    payload->contents = contents;
    payload->contents_length = contents_length;
    payload->context = context;
    output->type = L_AND;
    output->contents.nested = payload;
    
  }
    break;
   
    
  case 3:{//or
  
    Context * context = &(tokens[*tokens_counter]->context);
        
    int contents_length = oracle_item.elements_size;
    LogicVerb * contents = arenalloc(sizeof(LogicVerb) * contents_length);
    (*tokens_counter)++;
    for (int i = 0; i < contents_length; i++) {
      logic_verb_parse(contents+i, tokens, tokens_size, tokens_counter,
                   oracle, oracle_size, oracle_counter);
      (*tokens_counter)++;
      if (i != (contents_length-1))
        (*tokens_counter)++;
    }
    struct verb_nested * payload = arenalloc(sizeof(struct verb_nested));
    payload->contents = contents;
    payload->contents_length = contents_length;
    payload->context = context;
    output->type = L_OR;
    output->contents.nested = payload;
    
  }
    break;
    
  default:
    assert(false);
  }
  

}

void logic_verb_oracle(Token** tokens, const int tokens_size, int * tokens_counter,
                       OracleItem * oracle, const int oracle_size, int * oracle_counter){

    
  (*oracle_counter)++;
  OILogicVerb * oracle_item = &(oracle + (*oracle_counter))->logic_verb;
  oracle_item->tag = OI_LOGIC_VERB;
  int * type_indicator = &oracle_item->variant;
  
  

  assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
  Keyword * firsttoken = (Keyword *) tokens[*tokens_counter];
  
  VerbType type = false;

   
  if (firsttoken->keyword == K_ANGLE_LEFT){
    *type_indicator = 1;
    sentence_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
    return;
  } else if (firsttoken->keyword == K_CURLY_LEFT){
    int * item_counter = &oracle_item->elements_size;
    *item_counter = 1;
    (*tokens_counter)++;
    logic_verb_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
    (*tokens_counter)++;
    while (!(tokens[*tokens_counter]->token_type == T_KEYWORD &&
             ((Keyword *)tokens[*tokens_counter])->keyword == K_CURLY_RIGHT)){
      assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
      Keyword * current_token = (Keyword *) tokens[*tokens_counter];
     
      if (!type) {
        
        switch (current_token->keyword){
        case K_AND: {
          type = L_AND;
          *type_indicator = 2;
        }
          break;
        case K_OR: {
          type = L_OR;
          *type_indicator = 3;
        }
          break;
        default: {
          printf("Syntax Error: unexpected keyword %s at %i:%i in %s\n", KEYWORDS[current_token->keyword], current_token->context.line_number, current_token->context.column_number, current_token->context.file_name);
            exit(1);
        }

        }
      } else {
        if (verb_type_to_keyword_type(type) != current_token->keyword){
          printf("Syntax Error: expected %s instead of %s at %i:%i in %s\n", KEYWORDS[verb_type_to_keyword_type(type)],  KEYWORDS[current_token->keyword], current_token->context.line_number, current_token->context.column_number, current_token->context.file_name);
            exit(1);
        }
        
        (*tokens_counter)++;
        logic_verb_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
        (*tokens_counter)++;
        (*item_counter)++;
        
      }

    }

  } else {
    assert(false); //unsupported token type
  }


}




void clause_parse(Clause * output, Token** tokens, const int tokens_size, int * tokens_counter,
                          OracleItem * oracle, const int oracle_size, int * oracle_counter){
  (*oracle_counter)++;
  OIClause oracle_item = oracle[*oracle_counter].clause;
  assert(oracle_item.tag == OI_CLAUSE);
  int kind = oracle_item.variant;
  Sentence * head = arenalloc(sizeof(Sentence));
  sentence_parse(head, tokens, tokens_size, tokens_counter,
                   oracle, oracle_size, oracle_counter);
  LogicVerb * body = NULL;
  
  
  switch (kind){
  case 1:{
    (*tokens_counter)++;
    (*tokens_counter)++;
    body = arenalloc(sizeof(LogicVerb));
    logic_verb_parse(body, tokens, tokens_size, tokens_counter,
                   oracle, oracle_size, oracle_counter);
    
  }
    break;
  case 2: {}
    break;
  default:
    assert(false);
  }
  
  output->body = body;
  output->head = head;
  output->context = head->context; //seems a little redundant
  
  
}


void clause_oracle(Token** tokens, const int tokens_size, int * tokens_counter,
                       OracleItem * oracle, const int oracle_size, int * oracle_counter){
  (*oracle_counter)++;

  OIClause * oracle_item = &(oracle + (*oracle_counter))->clause;
  oracle_item->tag = OI_CLAUSE;
  int * kind = &oracle_item->variant;
  sentence_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
  (*tokens_counter)++;
  
  if (*tokens_counter < tokens_size &&
      tokens[*tokens_counter]->token_type == T_KEYWORD &&
      ((Keyword *)tokens[*tokens_counter])->keyword == K_IF){
    *kind = 1;
    (*tokens_counter)++;
    logic_verb_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
  } else
    {
      (*tokens_counter)--;
      *kind = 2;
    }
  
}


void items_parse(AddRemSentence * output, int * len, Token** tokens, const int tokens_size, int * tokens_counter,
                          OracleItem * oracle, const int oracle_size, int * oracle_counter){
  (*oracle_counter)++;

  OIItems oracle_item = oracle[*oracle_counter].items;
  assert(oracle_item.tag == OI_ITEMS);
  
  len  = &oracle_item.elements_size;
  output = arenalloc(sizeof(AddRemSentence)*(*len));
  for (int i = 0; i < (*len); i++){
    if (*tokens_counter < tokens_size &&
        tokens[*tokens_counter]->token_type == T_KEYWORD &&
        (
         ((Keyword *)tokens[*tokens_counter])->keyword == K_NOT
         ||
         ((Keyword *)tokens[*tokens_counter])->keyword == K_REMOVES
         )
        )
      {
        output[i].remove = true;
        (*tokens_counter)++;
      } else output[i].remove = false;

    sentence_parse(&output[i].s, tokens, tokens_size, tokens_counter,
                   oracle, oracle_size, oracle_counter);
    (*tokens_counter)++;
    if (*tokens_counter < tokens_size &&
        tokens[*tokens_counter]->token_type == T_KEYWORD &&
        ((Keyword *)tokens[*tokens_counter])->keyword == K_AND){
      (*tokens_counter)++;
    } else {
      (*tokens_counter)--; //so that is fits the convention
      assert(i == (*len)-1);
    }
    
  }
  
}

void items_oracle(Token** tokens, const int tokens_size, int * tokens_counter,
                       OracleItem * oracle, const int oracle_size, int * oracle_counter){
  (*oracle_counter)++;

  OIItems * oracle_item = &(oracle + (*oracle_counter))->items;
  oracle_item->tag = OI_ITEMS;
  int * item_count = &oracle_item->elements_size;
  item_count = 0;
  //(*tokens_counter)++;

  
  while(true){
    item_count++;

    if (*tokens_counter < tokens_size &&
      tokens[*tokens_counter]->token_type == T_KEYWORD &&
        (
         ((Keyword *)tokens[*tokens_counter])->keyword == K_NOT
         ||
         ((Keyword *)tokens[*tokens_counter])->keyword == K_REMOVES
         )
        ){
      (*tokens_counter)++;
    }
    sentence_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
    (*tokens_counter)++;

    if (*tokens_counter < tokens_size &&
      tokens[*tokens_counter]->token_type == T_KEYWORD &&
      ((Keyword *)tokens[*tokens_counter])->keyword == K_AND){
      (*tokens_counter)++;
      continue;
    } else {
      (*tokens_counter)--; //so that is fits the convention
      break;
    }
  }
  
}




void parameters_parse(Parameters * output, Token** tokens, const int tokens_size, int * tokens_counter,
                          OracleItem * oracle, const int oracle_size, int * oracle_counter){

  (*oracle_counter)++;
  OIParameters oracle_item = oracle[*oracle_counter].parameters;
  assert(oracle_item.tag == OI_PARAMETERS);
  output = arenalloc(sizeof(AddRemSentence));
  output->preconds = NULL;
  output->effects = NULL;
  output->description = NULL;
  output->logic = NULL;
  
  bool runloop = true;
  while(runloop){
    assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
    switch(((Keyword *)tokens[*tokens_counter])->keyword) {
      case K_AVAILABLE :{
        assert(output->preconds == NULL);
        (*tokens_counter)++;
        assert(((Keyword *)tokens[*tokens_counter])->keyword == K_WHEN);
        (*tokens_counter)++;
        items_parse(output->preconds, &output->preconds_length, tokens, tokens_size, tokens_counter,
                     oracle, oracle_size, oracle_counter);
      }
        break;
      case K_SUCH :{
        assert(output->logic == NULL);
        (*tokens_counter)++;
        assert(((Keyword *)tokens[*tokens_counter])->keyword == K_THAT);
        (*tokens_counter)++;
        logic_verb_parse(output->logic, tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
      }
        break;
    case K_DISPLAYS :{
      assert(output->description == NULL);
      (*tokens_counter)++;
      sentence_parse(output->description, tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
    }
      break;
    case K_CAUSES :{
      assert(output->effects == NULL);
      (*tokens_counter)++;
      items_parse(output->effects, &output->effects_length, tokens, tokens_size, tokens_counter,
                     oracle, oracle_size, oracle_counter);
      
      }
      break;
    default :{
      runloop = false;
    }
      
        
    }
    
  }

}

void parameters_oracle(Token** tokens, const int tokens_size, int * tokens_counter,
                       OracleItem * oracle, const int oracle_size, int * oracle_counter){
  (*oracle_counter)++;
  OIParameters * oracle_item = &(oracle + (*oracle_counter))->parameters;
  oracle_item->tag = OI_PARAMETERS;
  bool runloop = true;
  while(runloop){
    assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
    switch(((Keyword *)tokens[*tokens_counter])->keyword) {
      case K_AVAILABLE :{
        (*tokens_counter)++;
        (*tokens_counter)++;
        items_oracle(tokens, tokens_size, tokens_counter,
                     oracle, oracle_size, oracle_counter);
        (*tokens_counter)++;
      }
        break;
      case K_SUCH :{
        (*tokens_counter)++;
        (*tokens_counter)++;
        logic_verb_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
        (*tokens_counter)++;
      }
        break;
    case K_DISPLAYS :{
      (*tokens_counter)++;
      sentence_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
      (*tokens_counter)++;
    }
      break;
    case K_CAUSES :{
      (*tokens_counter)++;
      items_oracle(tokens, tokens_size, tokens_counter,
                     oracle, oracle_size, oracle_counter);
      (*tokens_counter)++;
      }
      break;
    default :{
      runloop = false;
    }
      
    }
    
  }
  (*tokens_counter)--; //so that is fits the convention
}



void element_parse(Element * output, Token** tokens, const int tokens_size, int * tokens_counter,
                          OracleItem * oracle, const int oracle_size, int * oracle_counter){

  (*oracle_counter)++;
  OIElement oracle_item = oracle[*oracle_counter].element;
  assert(oracle_item.tag == OI_ELEMENT);
  output = arenalloc(sizeof(Element));
  output->name = NULL;
  output->priority = 0;
  output->params = NULL;
  output->deck = NULL;
  output->next_deck = NULL;

  assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
  switch(((Keyword *)tokens[*tokens_counter])->keyword) {
  case K_CHOICE:
    assert(oracle_item.element_tag == E_CHOICE);
    break;
  case K_ACTION:
    assert(oracle_item.element_tag == E_LATE_ACTION);
    break;
  case K_EARLY:
    (*tokens_counter)++;
    assert(oracle_item.element_tag == E_EARLY_ACTION);
    break;
  default:
    assert(false);
  }
  output->type = oracle_item.element_tag;
  (*tokens_counter)++;
  sentence_parse(output->name, tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);

  bool runloop = true;
  while(runloop){
    assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
    switch(((Keyword *)tokens[*tokens_counter])->keyword) {
    case K_LEADS:
      assert(output->next_deck == NULL);
      (*tokens_counter)++;
      (*tokens_counter)++;
      sentence_parse(output->next_deck, tokens, tokens_size, tokens_counter,
                      oracle, oracle_size, oracle_counter);
      (*tokens_counter)++;
      break;
      
    case K_IN:
      assert(output->deck == NULL);
      (*tokens_counter)++;
      sentence_parse(output->deck, tokens, tokens_size, tokens_counter,
                      oracle, oracle_size, oracle_counter);
      (*tokens_counter)++;
      break;
      
    case K_WITH:
      assert(output->priority == 0);
      (*tokens_counter)++;
      (*tokens_counter)++;
      assert(tokens[*tokens_counter]->token_type == T_NUMBER);
      Number * number = (Number *) tokens[*tokens_counter];
      output->priority = number->number;
      (*tokens_counter)++;
      break;
   
    default:
      runloop = false;
    } 
  }
  parameters_parse(output->params, tokens, tokens_size, tokens_counter,
                      oracle, oracle_size, oracle_counter);
  
}

void element_oracle(Token** tokens, const int tokens_size, int * tokens_counter,
                       OracleItem * oracle, const int oracle_size, int * oracle_counter){
  (*oracle_counter)++;
  OIElement * oracle_item = &(oracle + (*oracle_counter))->element;
  oracle_item->tag = OI_ELEMENT;
  assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
  switch(((Keyword *)tokens[*tokens_counter])->keyword) {
  case K_CHOICE:
    oracle_item->element_tag = E_CHOICE;
    break;
  case K_ACTION:
    oracle_item->element_tag = E_LATE_ACTION;
    break;
  case K_EARLY:
    (*tokens_counter)++;
    oracle_item->element_tag = E_EARLY_ACTION;
    break;
  default:
    assert(false);
  }
  (*tokens_counter)++;
  sentence_oracle(tokens, tokens_size, tokens_counter,
                      oracle, oracle_size, oracle_counter);
  (*tokens_counter)++;
  bool runloop = true;
  while(runloop){
    assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
    switch(((Keyword *)tokens[*tokens_counter])->keyword) {
    case K_LEADS:
      (*tokens_counter)++;
      (*tokens_counter)++;
      sentence_oracle(tokens, tokens_size, tokens_counter,
                      oracle, oracle_size, oracle_counter);
      (*tokens_counter)++;
      break;
      
    case K_IN:
      (*tokens_counter)++;
      sentence_oracle(tokens, tokens_size, tokens_counter,
                      oracle, oracle_size, oracle_counter);
      (*tokens_counter)++;
      break;
      
    case K_WITH:
      (*tokens_counter)++;
      (*tokens_counter)++;
      (*tokens_counter)++;
      break;
   
    default:
      runloop = false;
    }
    
  }
  
  parameters_oracle(tokens, tokens_size, tokens_counter,
                      oracle, oracle_size, oracle_counter);
  
}

void initial_parse(InitialState * output, Token** tokens, const int tokens_size, int * tokens_counter,
                          OracleItem * oracle, const int oracle_size, int * oracle_counter){

  (*oracle_counter)++;
  OIInitial oracle_item = oracle[*oracle_counter].initial;
  assert(oracle_item.tag == OI_INITIAL);
  output = arenalloc(sizeof(InitialState));
  (*tokens_counter)++;
  (*tokens_counter)++;
  (*tokens_counter)++;
  items_parse(output->init_state, &output->state_length, tokens, tokens_size, tokens_counter,
                     oracle, oracle_size, oracle_counter);
  if (oracle_item.has_description){
    (*tokens_counter)++;
    sentence_parse(output->init_description, tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
  } else {
    output->init_description = NULL;
  }
}

void initial_oracle(Token** tokens, const int tokens_size, int * tokens_counter,
                       OracleItem * oracle, const int oracle_size, int * oracle_counter){
  (*oracle_counter)++;
  OIInitial * oracle_item = &(oracle + (*oracle_counter))->initial;
  oracle_item->tag = OI_INITIAL;
  assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
  (*tokens_counter)++;
  (*tokens_counter)++;
  (*tokens_counter)++;
  items_oracle(tokens, tokens_size, tokens_counter,
		oracle, oracle_size, oracle_counter);
  (*tokens_counter)++;
  assert(*tokens_counter < tokens_size);
  assert(tokens[*tokens_counter]->token_type == T_KEYWORD);
  
  if (((Keyword *)tokens[*tokens_counter])->keyword == K_DISPLAYS){
  
    oracle_item->has_description = true;
    (*tokens_counter)++; 
    sentence_oracle(tokens, tokens_size, tokens_counter,
                    oracle, oracle_size, oracle_counter);
  } else {
      oracle_item->has_description = false;
  }
}

#include <errno.h>

long load_file(const char * filename){
  
   FILE *f = fopen(filename, "rb");
   if (f == NULL){
     printf("An error loading file %s!\n", filename);
     printf("%s\n", strerror(errno));
     exit(1);
   }
   
  fseek(f, 0, SEEK_END);
  
  long fsize = ftell(f);
  fseek(f, 0, SEEK_SET);  /* same as rewind(f); */
  file = malloc(fsize + 1);
  fread(file, 1, fsize, f);
  fclose(f);

  file[fsize] = 0;

  return fsize;

}

int consult_file_oracle(const char * filename, int * tokens_size){
  
  long fsize = load_file(filename);
  
  
  arena_capacity = (fsize + 200) * sizeof(char) * 640;
  arena_base = malloc(arena_capacity);
  char * new_filename = arenalloc(sizeof(char)* (strlen(filename)+1));
  strcpy(new_filename, filename);

  
  tokenize(new_filename, file, fsize, &tokens, tokens_size);
  
  
  for (int i = 0; i < (*tokens_size); i++) {
    token_print(tokens[i]); //token_print_whitespace(tokens[i]);
    printf("\n");
  }
  
  
  oracle_capacity =  sizeof(OracleItem) * (*tokens_size);
  oracle_base = malloc(arena_capacity);

  //this code tokenizes toplevel
  {
    int tokens_counter = 0;
    int oracle_counter = 1;

    bool inside_deck = false;
    while (tokens_counter < *tokens_size){
      
      
      assert(tokens[tokens_counter]->token_type == T_KEYWORD);
      OIToplevel * oracle_item = &(oracle_base + oracle_counter)->toplevel;
      oracle_item->tag = OI_TOPLEVEL;

      printf("%s\n", KEYWORDS[((Keyword *)tokens[tokens_counter])->keyword]);
      switch (((Keyword *)tokens[tokens_counter])->keyword){
      case K_ANGLE_LEFT:
        assert(!inside_deck);
        clause_oracle(tokens, *tokens_size, &tokens_counter,
                    oracle_base, oracle_current, &oracle_counter);
        tokens_counter++;
        oracle_item->toplevel_tag = TP_CLAUSE;
        break;
      case K_IN:
        assert(!inside_deck);
        tokens_counter++;
        sentence_oracle(tokens, *tokens_size, &tokens_counter,
                    oracle_base, oracle_current, &oracle_counter);
        tokens_counter++;
        inside_deck = true;
        oracle_item->toplevel_tag = TP_DECK_OPEN;
        break;
      case K_END:
        assert(inside_deck);
        tokens_counter++;
        sentence_oracle(tokens, *tokens_size, &tokens_counter,
                    oracle_base, oracle_current, &oracle_counter);
        tokens_counter++;
        inside_deck = false;
        oracle_item->toplevel_tag = TP_DECK_CLOSE;
        break;
      case K_INITIAL:
        assert(!inside_deck);
        initial_oracle(tokens, *tokens_size, &tokens_counter,
                    oracle_base, oracle_current, &oracle_counter);
        tokens_counter++;
        oracle_item->toplevel_tag = TP_INITIAL;
        break;
      case K_CHOICE:
      case K_EARLY:
      case K_ACTION:
        element_oracle(tokens, *tokens_size, &tokens_counter,
                    oracle_base, oracle_current, &oracle_counter);
        tokens_counter++;
        oracle_item->toplevel_tag = TP_ELEMENT;
        break;
      default:
        assert(false);
      }
      
      oracle_counter++;
      
    }
    
    for (int i = 1; i <= oracle_counter; i++){
      print_oracle_item(oracle_base + i);
    }
    
    printf("\n");

    return oracle_counter;
  }
  

}



