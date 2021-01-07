#include <stdbool.h>

typedef struct {
  char * leading_whitespace;
  int line_number;
  int column_number;
  char * file_name;
} Context;

typedef struct sentence Sentence;

//...maybe I should have just used a union.
typedef struct sentence {
  char * name;
  Sentence * elements;
  int elements_length;
  Context * context;
} Sentence;

typedef struct {
  void * is_not_variable; //NULL if it is a variable
  char * variable_name; 
  int variable_id; //unused, will be refactored out
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

typedef struct {
  Sentence s;
  bool remove;
} AddRemSentence;

typedef struct {
  AddRemSentence * preconds;
  int preconds_length;
  AddRemSentence * effects;
  int effects_length;
  Sentence * description;
  LogicVerb * logic;
} Parameters;

typedef enum {
              E_EARLY_ACTION,
              E_CHOICE,
              E_LATE_ACTION
} ElementType;

typedef struct {
  ElementType type;
  Sentence * name;
  int priority;
  Parameters * params;
  Sentence * deck;
  Sentence * next_deck;
} Element;

typedef struct {
  AddRemSentence * init_state;
  int state_length;
  Sentence * init_description;
} InitialState;

typedef struct token Token;
typedef union oracle_item OracleItem;

void consult_file(const char * filename, int * tokens_size);

void clause_parse(Clause * output, Token** tokens, const int tokens_size, int * tokens_counter,
             OracleItem * oracle, const int oracle_size, int * oracle_counter);

void element_parse(Element * output, Token** tokens, const int tokens_size, int * tokens_counter,
                   OracleItem * oracle, const int oracle_size, int * oracle_counter);

void initial_parse(InitialState * output, Token** tokens, const int tokens_size, int * tokens_counter,
              OracleItem * oracle, const int oracle_size, int * oracle_counter);

void clause_print(Clause * cl);

void globals_free();

Clause NULL_CLAUSE = {0, 0, 0};//this is embarassingly hard to do in rust


char * file;
char * arena_base;
OracleItem * oracle_base;
Token ** tokens;
