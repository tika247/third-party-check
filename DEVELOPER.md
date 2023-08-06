# 開発者用

## アプリの基本構成

- フロントエンド
    - Vue3
        - Composition API
        - Router
        - GrobalProps
- バックエンド
    - Node.js
        - simple-git
    - Batch ※Git操作用
    - Electron
        - electron-store

* 開発環境は`vue-cli-electron-builder`により整備
* フロントエンドとバックエンド共通でTypeScriptを採用
* フロントエンドとバックエンドはIPC（プロセス間通信）により相互に連携

## NPMコマンド

* 下記であげるNPMコマンド以外は重要性低

- `npm run e-build`
    - フロントエンドとバックエンドを統一（アプリとして実行できるようにする）
- `npm run start`
    - アプリを実行（`npm run e-build`された状態がアプリとして実行されます）
        - フロントエンド側ファイルを修正した場合：
            - 再度`npm run start`を実行。もしくは`npm run start`を実行中に`background.ts`を保存すると修正内容が反映された状態でアプリ実行されます
        - バックエンド側ファイルを修正した場合：
            - 修正内容が反映された状態でアプリ実行したい場合は再度`npm run e-build`してから`npm run start`を実行する必要があります
        　
- `npm run lint`
    - フロントエンド、バックエンドともにリンターに引っかかった項目を、修正できるものは修正してくれる

## アプリ格納先に格納するzipファイル作成方法

- `npm run e-build`を実行
- ルート直下に最新の`dist_electron`フォルダが作成される
- `dist_electron`フォルダに`/md/README.md`と`/md/DEVELOPER.md`を入れてあげる
- `dist_electron`フォルダをzip化して下記に格納する

```
\\mikan\section\26_CC\1_DC\tools\03_第3者チェックツール
```

## 行われているGit操作

Git操作は[simple-git](https://www.npmjs.com/package/simple-git)モジュールを使用  
* 一部バッチファイル使用のプロセスあり

- スタートボタン押下
    - 格納先にアクセスできなければエラーを吐く
    - ブランチ名にコマンド使用不可の文字列（&）があればエラーを吐く
    - チェックの対象が`release`ブランチでなければエラーを吐く
    - `git clean`（念のため）
    - `git diff` 作業中の末コミットがあればエラーを吐く
    - `git branch` チェック前にチェックアウトされているブランチを記憶する
    - `git fetch` （チェックするブランチがローカルに存在しない場合のみ）
    - `git checkout`
    - `git pull`（念のため）
    - `git diff`、`git archive`
        - アプリの.exe-fileと同階層に`@archive`フォルダーを作成する
        - このプロセスのみバッチファイルによって実行される
        - 差分出力の内容が多すぎる場合、`git archive`の仕様の関係で差分フォルダを出力できないため、他の手段にて第3者チェックを行うようエラーを吐く
- チェックボタン押下
    - `git clean`（念のため）
    - `@archive`フォルダーを削除する
    - `git checkout` チェック前のブランチにチェックアウトする
    - `git branch -D` 今回のチェックでフェッチされたブランチの場合、ローカルから削除する

## アプリによる納品物の自動チェック項目拡張方法

`/src/server/storageCheck/modules`配下に機能毎のtsファイルがあります。  
それらモジュールをexport、`/src/server/storageCheck/storageChecker.ts`でimportし実行しています。  
  
既存に倣ってファイルを追加、設計することで、  
他機能との既存関係はないため容易に拡張することができます。

## 今後実装したいこと

※ 打消し線引かれている項目は対応済み

- ~~差分量の多い差分抽出でも、問題なく差分抽出できるようにする~~
- ~~「&」がブランチ名に含まれていても、正常にGitコマンドが実行されるようにする~~
- ~~不要な納品物が含まれていないかチェックする~~
    - ~~NGワード~~
    - ~~ダミーファイルパス~~
    - ~~ダミーテキスト~~
    - ~~ダミー画像~~
    - ~~ファイル名同じで拡張子のみ異なる画像~~
    - ~~ゴミファイル~~
    - ~~納品物になりえない拡張子（.psdや.xdなど~~

※ その他（できれば対応したい。。）

- 差分抽出時にgitattributes（git archiveコマンドで差分抽出する）を通す
    - 差分量多い場合を対応する場合、本件は対応不可
- CommitがLatestのSHAのみ入力されている場合で、LatestのSHAがHEADのSHAと異なる場合にエラー吐く
    - 重要性低のため未対応