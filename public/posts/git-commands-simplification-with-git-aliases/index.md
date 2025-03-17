---
title: Git Commands Simplification with Git Aliases
description: If you're struggling to memorize all the weird git flags and commands, you definitely need to use it
date: 2025-03-17
tags: [git, alias, bash]
image: daniel-diemer.jpg
photoBy: Daniel Diemer
---

Every developer that was using git, asked him/herself: _"Why should I use this weird command here? How can I memorize all these non-intuitive flags?"_.
Or: _"Why I just cannot undo something with a quite simple command???"_
<br>
The answer for all of these questions is **git aliases**: in simple words, you can just redefine a complicated command with a shortcut.

## Creating an alias

The easiest and the most safe way to create a git alias is to use `git config --global alias.name 'command'`. For instance, you can create an alias to create a new branch this way:  
`git config --global alias.new 'checkout -b'`, and it will accept an argument as the original `git checkout` command:

```bash
git new feature-branch1
#same as
git checkout -b feature-branch2
```

How does it work? The `git config --global alias...` command inserts a new line into the [alias] section of your global configuration file:

```bash
$ cat ~/.gitconfig
[alias]
   new = checkout -b
```

Yes, you can can manually add, delete or modify your aliases right here, in `~/.gitconfig` file, but I find it less safe.

<note-info>
Since the alias will be executed in the context of Git, you should avoid including the word "git" in the alias command itself.
<br>
If your git command includes a single word, you may omit single quotes for alias.
</note-info>

## A way to fix typos

Although most articles and even the [original documentation](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases) offers you a way to create aliases that consist of several characters, I think this is the wrong way for using it.
Have any doubts? Try to guess what all of these mean than: `co`, `cob`, `ci`, `pu`. I prefer to enter aliases that I will not struggle to remember instead of saving a pair of seconds typing them.
<br>
But what is really useful is auto-fixing typos. Especially if you know you do same mistakes over and over again.
I usually type `git comit` missing a character. For me `git config --global alias.comit 'commit'` alias is really helpful. Other aliases using same approach (but you may use others for fixing your own typos):

```bash
[alias]
   branches = branch
   comit = commit
   chekout = checkout
   swithc = switch
```

## Undo changes made before

[The most on-demand](https://stackoverflow.com/questions/927358/how-do-i-undo-the-most-recent-local-commits-in-git) command is undoing a commit, and Git has even different options for doing that. I prefer using this: `git config --global alias.uncommit 'reset --soft HEAD^'`. This command will place you right to the point before you have entered the `git commit -m "message"` command (of course, if you mean something different under undoing a comment, you should use another command). Another well-known "undoing" option is unstage by running `reset HEAD --`. One more useful alias in this group if you often stash your commits is `git config --global alias.unstash 'stash pop'`. It will remove the last stash from its stack and immediately apply to your codebase.
<br>
A brief summary for this group of aliases:

```bash
[alias]
   uncommit = reset --soft HEAD^
   unstage = reset HEAD --
   unstash = stash pop
```

## More complex aliases

- If you start an alias with`!` character, it will be treated as a shell command, that has some extra-power. For example, sequential commands using the `&&` operator, which means that the next command will only run if the previous one succeeds. Try this one: `git config --global alias.new-branch '!git checkout main && git pull && git checkout -b'`. It will checkout you to the main branch, pull everything, create and checkout to the new branch.

```bash
#usage
git new-branch feat/UFR-1
```

- You may also want to use [positional parameters](https://adminschoice.com/bash-positional-parameters/) if you want to provide arguments in your alias. Unfortunately, you cannot do it directly in Git. Instead, you should use `!f() { ... }; f` to define a shell function f that can take an argument. Ie: you can [log](https://git-scm.com/docs/git-log#_commit_formatting) graphed comments by author using this alias: `git config --global alias.graph-by-author '!f() { git log --author="$1" --graph; }; f'`. Here `$1` is an argument for the function.

```bash
#Prints last five commits by User0k using graph
git graph-by-author User0k -5
```

The default git log is rather ugly and unreadable. One of the best prettifiers to keep it simple and readable is this alias `git config --global alias.log-pretty '!git log --pretty=format:"%C(auto)%h %C(red)%as %C(blue)%aN%C(auto)%d%C(green) %s"'`. It colorizes commit hash with default color (yellow), date with red, author with blue, leaves colors of HEAD and branches untouched, and colorizes text commit with green. Just compare this picture to what you usually get running git log (or you may play with these colors as well).

![How can you simplify git log with a custom alias](./log-pretty.gif 'Git log prettifier')

After you're satisfied with your new log, it may be helpful to combine it with other features. Let's find all commits by the author using a shell function! Run this alias: `git config --global alias.log-by-author '!f() { git log-pretty --author="$1"; }; f'`. You may also use numbers to print the desired number of commits similar to `graph-by-author` alias above.

![This logs commits by the author](./log-by-author.gif 'Git logs commits by the author')

If found this alias on [freecodecamp](https://www.freecodecamp.org/news/how-to-simplify-your-git-commands-with-git-aliases/) and applied preferred colors. It sorts list of branches by the most recent commit date and colorize output: `git config --global alias.branches '!git branch --format="%(HEAD) %(color:red)%(refname:short)%(color:yellow) - %(contents:subject) %(color:green)(%(committerdate:relative)) [%(authorname)]" --sort=-committerdate'`.

## List your aliases, modify and delete them

Modifying aliases is pretty straightforward: just create an alias with the same name (you can modify your `~/.gitconfig` file, remember?).
<br>
To delete alias you can execute this command: `git config --global --unset alias.name`. In rare cases when your alias has multiple values? you will get

```bash
$ git config --global --unset alias.alias-name
warning: alias.alias-name has multiple values
```

Use `--unset-all` flag in these cases. Again, if you want to create an alias for this, use a [shell function and positional parameters](#more-complex-aliases): `git config --global alias.alias-delete '!f() { git config --global --unset alias."$1"; }; f'`. Don't be be confused by using `git config --global` twice here.
<br>
The last for today is listing all aliases you have globally. If you run this weird command `git config --get-regexp alias`, you will get this:

![Unordered list of aliases](./aliases.JPG 'Looks like a mess, huh?')

The list is unsorted and its hard to understand where you have an alias and what it do exactly. First, let's sort it. Add `| sort` to your command: `git config --get-regexp alias | sort`. Looks a little bit better. Now if you want to colorize alias and its command, you may use [awk](https://unix.stackexchange.com/questions/669111/searching-and-coloring-lines-by-awk-or-other-method), and after playing with it a little, you may get something like this: `git config --global alias.aliases '!git config --get-regexp alias | sort | awk "{for(i=1;i<=NF;i++) if(i==1) printf \"\\033[1;33m%s\\033[0m \", \$i; else printf \"\\033[1;32m%s\\033[0m \", \$i; print \"\"}"'`. Weird, but it works really good for me:

![My precious aliases](./aliases-pretty.gif 'Look at this beauty!')
