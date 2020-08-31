CC=gcc
CFLAGS=-I.

run: main
	./main


main: main.c parser.c
	$(CC) -o main main.c parser.c -I.	
