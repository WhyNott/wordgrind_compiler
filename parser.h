

typedef struct {
  char * leading_whitespace;
  int line_number;
  int column_number;
  char * file_name;
} Context;

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


typedef struct token Token;

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
