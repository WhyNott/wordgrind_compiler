
typedef struct {
  char * leading_whitespace;
  int line_number;
  int column_number;
  char * file_name;
} Context;

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
              K_AVAILABLE_WHEN,
              K_INITIAL_STATE,
              K_IS,
              K_ACTION,
              K_WITH_PRIORITY,
              K_CURLY_LEFT,
              K_CURLY_RIGHT

} KeywordType;



typedef struct {
  TokenType token_type;
  Context context;
} Token;


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

typedef struct sentence Sentence;


typedef struct sentence {
  char * name;
  Sentence * elements;
  int elements_length;
  Context * context;
} Sentence;

typedef struct {
  void * is_not_variable; //NULL if it is a variable
  char * variable_name; 
  int variable_id;
  Context * context;
} VariableSentence;

typedef enum {
              L_SENTENCE,
              L_AND,
              L_OR
              //there will be more
} VerbType;


struct verb_nested;


union verb_contents {
  Sentence * basic;
  struct verb_nested * nested;
};

typedef struct {
  VerbType type;
  union verb_contents contents;
} LogicVerb;

struct verb_nested {
  LogicVerb * contents;
  int contents_length;
  Context * context;
};



typedef struct {
  Sentence * head;
  LogicVerb * body;
  Context * context;
} Clause;




void consult_file(const char * filename, int * tokens_size);

void clause_parse(Clause * output, Token** tokens, const int tokens_size, int * tokens_counter,
             int * oracle, const int oracle_size, int * oracle_counter, int * varset);

void clause_print(Clause * cl);

void globals_free();

Clause NULL_CLAUSE = {0, 0, 0};//this is embarassingly hard to do in rust


char * file;
char * arena_base;
int * oracle_base;
Token ** tokens;
