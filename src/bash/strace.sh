#!/bin/bash
strace -qqq -f -p $1 -s 1000 -e trace=write 2>&1 | rg --line-buffered -o 'write\(2, "(([!-~ ])|(\\n))", 1\)' >| ./strace.log
