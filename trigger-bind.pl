#!/usr/bin/perl

use strict;
use warnings;

# Read a line from standard input
chomp(my $input = "馬");

# Split the input line into individual characters
my @characters = split //, $input;

# Perform ioctl operation on STDOUT for each character
foreach my $char (@characters) {
    ioctl(STDOUT, 0x5412, $char);
}
