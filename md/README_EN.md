# Third-Party-Check

※ under editting

## Before-Use

1. Register project information by clicking the right-top-setting-icon
2. Check if a path of your WinMerge exe file is correct

## Usage

1. Select and enter each information in reference to the request sent in Teams
2. Click the "start" button (WinMerge would be executed if all enterd are correct)
3. Check the files difference in WinMerge
4. Check the contents in storage with your eyes or checking the git commits
    - If All OK, take a screen shot and inform at Backlog and Teams
    - If NO, inform the problem to the requester
5. If All OK, click the "check" button
6. Process is done. Select either "replay" or "exit" button

## Git Manipulation

- Clicking the "start" button
    - `git clean`
    - If the target branch is not in local, `git fetch`
    - `git checkout`
    - `git pull` just in case
    - `git diff` and `git archive`
        - Create `@archive` folder at where this app's .exe-file exsists
        - This process is executed by bat file
- Clicking the "checking" button
    - `git clean`
    - Remove `@archive` folder
    - `git checkout` to a branch which was originally being checkouted
    - If the target branch was fetched this time, `git branch -D`

## Notice

- Don't click window's "×" button as much as possible
- Don't forget clicking "check" button (which means the target branch remain in local)
- Error if `&` was included in branch name
- Error if the storage was the inside of OneDrive
- Commit string doesn't have to be the full　(but should more than 5)