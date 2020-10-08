# TypeScipt Template Repository

> Bootstrap your next TypeScipt project by using this [GitHub Template](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-template-repository) repository

This project comes with the following tools:

- TypeScript
- Code Quality
  - [x] ESLint
  - [x] TypeDoc
  - [x] Jest (TDD)
  - [ ] GitHub Issue/PR Templates
  - [ ] README templates
- Code Velocity
  - [ ] GitHub Actions (CI/CD)
  - [ ] CodeClimate (CI)
  - [ ] [commitlint](https://github.com/conventional-changelog/commitlint) (using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)) (CI)
  - [ ] Semantic Release (CD)

## Usage

### Install

Click on the green button above that says "Use this template".

### Update

To merge any advances that the template makes into your project:

```
git remote add template git@github.com:MichaelHirn/ts-template.git
git fetch --all
git merge template/master --allow-unrelated-histories # or some other branch
```
