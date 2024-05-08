#include <iostream>
#include <unistd.h>
#include <sys/inotify.h>

#define EVENT_SIZE (sizeof(struct inotify_event))
#define BUF_LEN (1024 * (EVENT_SIZE + 16))

// g++ -O3 -o my_inotify my_inotify.cpp
int main(int argc, char **argv)
{
    if (argc < 2)
    {
        std::cerr << "You need to provide file path" << std::endl;
        return 1;
    }

    int fd, wd;
    char buffer[BUF_LEN];

    // Initialize inotify
    fd = inotify_init();
    if (fd < 0)
    {
        std::cerr << "Error initializing inotify" << std::endl;
        return 1;
    }

    // Add a watch for the file
    const char *file_path = argv[1];
    // const char *file_path = "./example.txt"; // Change this to your file's path
    wd = inotify_add_watch(fd, file_path, IN_MODIFY);
    if (wd == -1)
    {
        std::cerr << "Error adding watch for file" << std::endl;
        close(fd);
        return 1;
    }

    // Monitor events
    // std::cout << "Waiting for write event on file: " << file_path << std::endl;
    ssize_t len = read(fd, buffer, BUF_LEN);
    if (len < 0)
    {
        std::cerr << "Error reading inotify events" << std::endl;
        close(fd);
        return 1;
    }

    // Check if the event is a write event
    struct inotify_event *event = (struct inotify_event *)buffer;
    if (event->mask & IN_MODIFY)
    {
        // std::cout << "Write event detected on file: " << file_path << std::endl;
    }

    // Clean up
    inotify_rm_watch(fd, wd);
    close(fd);

    return 0;
}
