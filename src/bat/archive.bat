::
:: archive as @archive folder and output in the current directory
::

:: start
@echo off
setlocal ENABLEDELAYEDEXPANSION

:: to UTF-8
chcp 65001

:: set variable
if "%2" EQU "" (
  set COMMIT_NEW=HEAD
  set COMMIT_OLD=%1
) else (
  set COMMIT_NEW=%1
  set COMMIT_OLD=%2
)

set GIT_EXE=git

set TARGET_LOCAL_PATH=%3

:: dp0 means a directory where this bat file exsist
:: if dp0 changes, current directory changes upword according to the number you specified
:: ex) %~dp2 means 2 directory upword
set OUTPUT_DIR_ROOT=%~dp0
set OUTPUT_DIR_NAME=@archive
mkdir %OUTPUT_DIR_ROOT%%OUTPUT_DIR_NAME%
@REM set OUTPUT_DIR_NAME_ZIP=@archive.zip

:: for loop
set /a CHECKOUT_FILE_CHAR_MAX=1000
set /a CMD_LEN=0
set DIFF_LIST=""

:: move to a target directory
cd /d %TARGET_LOCAL_PATH%

:: git-diff
for /f "usebackq" %%A in (`%GIT_EXE% diff --name-only --diff-filter=ACMR %COMMIT_OLD%..%COMMIT_NEW%`) do (
    call :FOR_PROC %%A "!DIFF_LIST!"
)

:: output diff
call :GIT_CHECKOUT_INDEX "!DIFF_LIST!"

:: if no diff, stop this process here
if %DIFF_LIST% EQU "" (
:: remove zip
echo %OUTPUT_DIR_ROOT%%OUTPUT_DIR_NAME%
rd /s /q %OUTPUT_DIR_ROOT%%OUTPUT_DIR_NAME%
  :: move to the current
cd /d %OUTPUT_DIR_ROOT%
:: to detect this process should be skipped in gitCommand.ts, do the below one more time
rd /s /q %OUTPUT_DIR_ROOT%%OUTPUT_DIR_NAME%
:: end
exit /b
endlocal
)

echo output diff into %OUTPUT_DIR_ROOT%%OUTPUT_DIR_NAME%
exit /b

:FOR_PROC
    set TMP_FILE_NAME=%1
    :LEN_LOOP
    if not "%TMP_FILE_NAME%"=="" (
        set TMP_FILE_NAME=%TMP_FILE_NAME:~1%
        set /a CMD_LEN=%CMD_LEN%+1
        goto LEN_LOOP
    )

    set /a CMD_LEN=%CMD_LEN%+1

    if %CMD_LEN% LEQ %CHECKOUT_FILE_CHAR_MAX% (
        if !DIFF_LIST!=="" (
            set DIFF_LIST=%1
        ) else (
            set DIFF_LIST=!DIFF_LIST! %1
        )

    ) else (
        set /a CMD_LEN=0
        call :GIT_CHECKOUT_INDEX "!DIFF_LIST!"
        set DIFF_LIST=%1
    )
exit /b

:GIT_CHECKOUT_INDEX
    set TMP_CHECKOUT_LIST=%1
    set TMP_CHECKOUT_LIST=%TMP_CHECKOUT_LIST:~1%
    set TMP_CHECKOUT_LIST=%TMP_CHECKOUT_LIST:~-0,-1%

    %GIT_EXE% checkout-index --prefix=%OUTPUT_DIR_ROOT%%OUTPUT_DIR_NAME%\ -f %TMP_CHECKOUT_LIST%
exit /b

:: move to the current
cd /d %OUTPUT_DIR_ROOT%

:: end
exit /b
endlocal