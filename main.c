#include <stdlib.h>
#include <stdio.h>

#include "parser.h"



int main(int argc, char **argv){
 
 
  char * filename = "test_4.wg";
  int tokens_size = 0;
  consult_file(filename, &tokens_size);
 {
   Clause cl;
   int tokens_counter = 0;
   int oracle_counter = 0;
   int varset = 0;
   while (tokens_counter < tokens_size){
     clause_parse(&cl, tokens,  &tokens_counter,
                  oracle_base,  &oracle_counter, &varset);
     clause_print(&cl);
     printf("\n");
     tokens_counter++;
 
   }
 
 }

 test_indexed_strings();
 
 globals_free();
 
}





