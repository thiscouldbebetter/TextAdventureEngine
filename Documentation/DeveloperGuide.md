This Could Be Better Text Adventure Engine Developer Guide
==========================================================

Follow the instructions below to create a new game using the This Could Be Better Text Adventure Engine.

1. Create a new game directory, for example, "MyTextAdventureGame".  The name of this directory will also be the name of a Git repository.

2. Open a command prompt window in the newly created game directory.

3. Enter the command "git init" to make the game directory into the root of a Git source control repository.

4. In the game directory, create a new subdirectory named "Source".

5. In the command prompt directory, run "cd Source" to switch to the newly created Source subdirectory.

6. From within the Source subdirectory, run the command "git submodule add https://github.com/thiscouldbebetter/TextAdventureEngine Engine" to clone the TextAdventureEngine repository as a Git submodule.

7. Open a file explorer window and navigate to the newly created Engine subdirectory.

8. Copy the direcotry "Stub" and all its contents into the clipboard.

9. In the file explorer, navigate back up to the parent Source directory.

10. Paste the Stub directory into the Source directory and rename it to "Game".

11. Within the newly pasted "Game" directory, copy the Stub.html file to the parent directory.

12. Rename Stub.html to match the name of the repository previously decided in step 1.

13. Open the .html file in a web browser that runs JavaScript.

14. Verify that a demo game is displayed.

15. If desired, add a Readme.md, a License.txt, and other files in the root directory of the Git repository.

16. From the root directory, run the command "git commit -m 'Initial commit.'".

17. Run the command "git remote add origin <url>", substituting a valid Git repository URL where specified.

18. Run the command "git push -u origin master" to push the newly created repository to origin.
