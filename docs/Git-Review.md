# Git Review

This document explains what `git status` shows, what `origin/main` means, and what a "clean" vs "dirty" working tree is, along with some related background.

---

## What `git status` Does

Command:

```bash
git status
```

**Purpose:**

- Shows the current **branch** you are on.
- Shows how your local branch compares to its **remote tracking branch** (e.g. `origin/main`).
- Lists changes in your working directory and staging area:
  - New files Git doesn’t know about yet (untracked).
  - Modified files.
  - Files that are staged (ready to be committed).

In short, `git status` answers: *"What’s going on in this repo right now?"*

Example output you saw:

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

---

## Branches and `origin/main`

### What is a branch?

- A **branch** is just a movable pointer to a specific commit (a line of development).
- `main` is the default primary branch name in many modern Git setups (used to be `master`).

### What is `origin`?

- `origin` is the **default name** Git gives to the **remote** you cloned from or added.
- A **remote** is simply another copy of the repository, usually on a server like GitHub, GitLab, or Bitbucket.
- You can see all remotes with:

  ```bash
  git remote -v
  ```

  Typical output:

  ```text
  origin  git@github.com:username/repo.git (fetch)
  origin  git@github.com:username/repo.git (push)
  ```

### What does `origin/main` mean?

- `origin/main` is **the `main` branch on the remote called `origin`**.
- Your local `main` often **tracks** this remote branch, meaning:
  - Git knows that local `main` corresponds to remote `origin/main`.
  - Git can tell whether your local branch is **ahead of**, **behind**, or **up to date with** `origin/main`.

This *tracking relationship* is typically created when you:

- Clone a repo:

  ```bash
  git clone git@github.com:username/repo.git
  ```

- Or when you push a branch with `-u` (set upstream):

  ```bash
  git push -u origin main
  ```

### Is `origin/main` created by `git init -b main`?

- **No.** `git init -b main` only:
  - Creates a **local Git repository**.
  - Sets `main` as the **initial branch name**.
- It does **not** create a remote or `origin/main`.

To create and associate a remote after `git init`, you do something like:

```bash
# Add the remote
git remote add origin git@github.com:username/repo.git

# Push your main branch and set origin/main as the upstream tracking branch
git push -u origin main
```

After this, `origin/main` exists (on the remote), and your local `main` tracks it.

---

## "Your branch is up to date with 'origin/main'"

When `git status` says:

```text
Your branch is up to date with 'origin/main'.
```

This means:

- The commit that `main` points to **locally** is the same as the commit that `origin/main` points to **on the remote**.
- There are **no new commits** locally that the remote doesn’t have.
- There are **no new commits** on the remote that you haven’t pulled yet.

Other possible messages:

- **"Your branch is ahead of 'origin/main' by N commits"**
  - You have **local commits** that haven’t been pushed to the remote yet.
- **"Your branch is behind 'origin/main' by N commits"**
  - The remote has **new commits** you don’t have locally. Run:

    ```bash
    git pull
    ```

- **"Your branch and 'origin/main' have diverged"**
  - Both local and remote have different new commits; usually resolved with a merge or rebase.

---

## Working Tree: "Clean" vs "Dirty"

### What is the working tree?

- The **working tree** (or working directory) is the **actual files** on disk that you edit in your editor.
- Git also maintains:
  - The **staging area** (also "index"): files that are marked to go into the next commit.
  - The **repository**: the history of commits.

### "working tree clean"

When `git status` prints:

```text
nothing to commit, working tree clean
```

It means:

- There are **no modified files** compared to the last commit.
- There are **no untracked files** (or you’ve told Git to ignore them via `.gitignore`).
- There are **no staged but uncommitted changes**.

In other words, your local files exactly match the last commit on your current branch.

### What does it mean for the working tree to be "dirty"?

A **dirty** working tree just means there are changes that haven’t been committed yet. For example:

- You edit `content.js` but don’t stage or commit it.
- You create a new file `notes.txt` that Git isn’t tracking.
- You stage some changes but haven’t run `git commit` yet.

Typical `git status` output in a dirty state:

```text
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   content.js

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        notes.txt
```

Here Git is telling you exactly what’s changed and what your options are.

---

## Common Commands Related to These Concepts

### See status (where you are now)

```bash
git status
```

### See which branch you’re on

```bash
git branch
```

- The `*` marks the current branch (e.g. `* main`).

### See remotes and where they point

```bash
git remote -v
```

### Set up a remote after `git init`

```bash
# Initialize a repo with main as the first branch
git init -b main

# Add a remote
git remote add origin git@github.com:username/repo.git

# Make your first commit
git add .
git commit -m "chore: initial commit"

# Push and set upstream
git push -u origin main
```

### Check how your branch compares with the remote

```bash
git status
# or
git fetch
git status
```

`git fetch` updates your knowledge of remote branches (like `origin/main`) without changing your local files.

---

## Quick Mental Model

- **Repository**: the commit history (what’s already saved).
- **Branch**: a named pointer to a commit (e.g. `main`, `feat/ab-loop-points`).
- **Remote**: another copy of the repo (e.g. `origin` on GitHub).
- **Remote branch**: branch on the remote (e.g. `origin/main`).
- **Working tree**: your actual files.
- **Staging area**: the set of changes you plan to commit next.

`git status` is your dashboard:

- Which branch am I on?
- How does it relate to the remote (`origin/main`)?
- Is my working tree clean or dirty?
- Which files are changed, staged, or untracked?

Use it frequently to understand "where you are" before you run other Git commands.
