# Sports Card Investor -- Dev Challenge

Welcome! This repository contains two independent challenges designed to assess your real-world software engineering skills: a **Code Review** and a **CDK + Lambda + GitHub Actions build**.  
You can complete one or both, depending on the role or what you’ve been asked to do.

---

## Challenge Overview

1. **Code Review Challenge**
    - Critically review provided TypeScript and SQL files, focusing on security, code quality, and best practices.

2. **CDK + Lambda + GitHub Actions Build Challenge**
    - Build and deploy a serverless API using AWS CDK, Lambda, and GitHub Actions that fetches Magic: The Gathering Wizards.

---

## 1. Code Review Challenge

**Files to review:**
- [`lessobnoxiouscode.ts`](code-review/lessobnoxiouscode.ts)
- [`nightmare.sql`](code-review/nightmare.sql)

### **Instructions:**

- **Review both files for issues** (bugs, anti-patterns, etc.).
- **Prioritize security issues** first—highlight and comment on any vulnerabilities or insecure patterns you spot.

### **How to Comment:**
1. **Add comments directly** in the code using `//` or `/* ... */` (TypeScript), and `--` (SQL).
2. **Mark each issue** with a brief explanation.
3. **Categorize** issues (e.g. Security, TypeScript, Style, Logic, Performance).
4. **Suggest fixes** where possible.
5. **Rate severity** (Critical, High, Medium, Low).

#### Example Comment Format:
```typescript
// CRITICAL SECURITY: SQL Injection vulnerability - user input directly interpolated
// TYPESCRIPT: Unnecessary type assertion - TypeScript can infer this type
// STYLE: Violates naming convention - should be camelCase
// LOGIC: Function may return undefined when called with invalid input
````

### **How to Submit:**

* Push your code review comments to your fork or branch.
* Share the link to your reviewed files (GitHub PR, gist, or repo).
* Or, submit `lessobnoxiouscode.reviewed.ts` and `nightmare.reviewed.sql` as separate files.

---

## 2.  CDK + Lambda + GitHub Actions Build Challenge

**Goal:** Deploy a serverless API that fetches and returns Magic: The Gathering "Wizards" via AWS CDK!

### **Requirements:**

1. **AWS CDK App:**

    * Deploys a Lambda function (Node.js/TypeScript, `bun`/`pnpm`/`yarn` preferred).
    * API Gateway exposes `/wizards`.
    * Lambda fetches all "wizards" (subtype "Wizard") from the [MTG API](https://docs.magicthegathering.io/).
    * Returns these wizards sorted by `power` (descending).
    * **Bonus:** Only return `{ name, type, power, toughness, rarity, flavor, colors, manaCost, imageUrl }`.

2. **GitHub Actions Workflow:**

    * Installs dependencies (`bun install`, `pnpm install`, or `yarn install`).
    * Builds if needed.
    * Deploys the CDK stack (`npx cdk deploy --require-approval never`), using AWS credentials from GitHub Actions secrets.
    * **Bonus:** Add a test step if you include tests.
    * Commit workflow as `.github/workflows/deploy.yml`.

   **Workflow should:**

    * Deploy automatically on pushes to `main` (or use a manual trigger).
    * Document any AWS/environment setup in your README.

3. **Deliverables:**

    * Push your code to a public (or invited) GitHub repo.
    * Include a `README.md` with setup instructions, workflow overview, package manager used, and API usage instructions.

4. **Note:**

    * **Use your own AWS account** (Free Tier is fine). Do **not** use company or shared credentials.
    * If unable to deploy, document your CDK stack, provide logs/screenshots from `cdk synth`.

---

## Communication is the biggest part of the challenge.

- Please let me know if you have any questions, concerns, roadblocks, or brags.


## Show Me What You Got

Push your code and reviews, share your repo or PR link, and let’s see your engineering skills in action!

![Show Me What You Got](https://media1.tenor.com/m/c3GPoqtlUqEAAAAd/goat-tribe-lfgoat.gif)