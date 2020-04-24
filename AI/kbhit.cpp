/**
 Linux (POSIX) implementation of _kbhit().
 Morgan McGuire, morgan@cs.brown.edu
 */
#include <sys/ioctl.h>
#include <stdio.h>
#include <sys/select.h>
#include <termios.h>
#include <stropts.h>
#include <stdbool.h>

int kbhit() {
    static const int STDIN = 0;
    static bool initialized = false;

    if (! initialized) {
        // Use termios to turn off line buffering
        termios term;
        tcgetattr(STDIN, &term);
        term.c_lflag &= ~ICANON;
        tcsetattr(STDIN, TCSANOW, &term);
        setbuf(stdin, NULL);
        initialized = true;
    }

    int bytesWaiting;
    ioctl(STDIN, FIONREAD, &bytesWaiting);
    return bytesWaiting;
}

// //////////////////////////////////////////////
// //    Simple demo of kbhit()

// #include <unistd.h>

// int main(int argc, char** argv) {
//     printf("Press any key");
//     while (!kbhit()) {
//         printf(".");
//         fflush(stdout);
//         usleep(1000);
//     }
//     printf(getch());

//     return 0;
// }