# 🧙‍♂️ CDK + Lambda + GitHub Actions Coding Challenge

## 1. **Build a Simple Serverless "MTG Wizards API" using AWS CDK, Lambda, and GitHub Actions

### **Your task:**

- Write a small TypeScript AWS CDK app that:

    - Deploys a Lambda function (Node.js/TypeScript runtime; `bun`, `pnpm`, or `yarn` preferred).

    - Exposes the Lambda via API Gateway at `/wizards`.

    - The Lambda should fetch all Magic: The Gathering "wizards" (subtype "Wizard") from the [MTG API](https://docs.magicthegathering.io/).

    - Returns these wizards sorted by their `power` (descending order; highest first).

    - **Bonus:** Return only a minimal shape per card, e.g.:

        ```json
        {
          "name": "Jace, Vryn's Prodigy",
          "type": "Legendary Creature — Human Wizard",
          "power": "2",
          "toughness": "1",
          "rarity": "Mythic Rare",
          "flavor": "...",
          "colors": ["Blue"],
          "manaCost": "{1}{U}",
          "imageUrl": "https://..."
        }
        ```


---

## 2. **Automate Deployment with GitHub Actions

- Write a GitHub Actions workflow that:

    - Runs your package manager's install command (`bun install`, `pnpm install`, or `yarn install`).  
      **Please indicate which package manager you use in this README.**

    - Builds your code if needed (`bun run build`, `pnpm run build`, or `yarn build`).

    - Deploys the CDK stack automatically as part of the workflow, using AWS credentials/secrets stored as GitHub Actions secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`).

    - **Bonus:** Add a test step (`bun test`, `pnpm test`, or `yarn test`) if you include tests.


### **Your workflow should:**

- Check out the repo code.

- Set up Node.js and your package manager of choice.

- Install dependencies.

- Synthesize and deploy the CDK stack (e.g., `npx cdk deploy --require-approval never`).

- Be committed to your repo as `.github/workflows/deploy.yml` (or similar).


### **Tips:**

- Your workflow should deploy the stack automatically on pushes to `main` (or use a manual trigger—please specify).

- Note any assumptions about AWS credentials, stack names, or environment requirements in your README.

- Document any environment variables, secrets, or specific AWS regions you use.

- Communication is the bigggest part of the challenge. Please let me know if you have any questions, concerns, roadblocks, or brags. 


---

## **Example Workflow Steps (for GitHub Actions):**

1. `actions/checkout@v4`

2. Set up Node.js (`actions/setup-node@v4`) and your package manager.

3. Install dependencies (`bun install`, `pnpm install`, or `yarn install`).

4. Build your CDK app if needed.

5. Deploy the CDK stack with:

    ```bash
    npx cdk synth
    npx cdk deploy --require-approval never
    ```

6. (Optional) Run tests.


---

## 3. **Deliverables**

- Push your code (including CDK (but no credentials/env/sensitive stuff) to a public (or invited) GitHub repo.

- Include a `README.md` explaining:
    - How to set up the repo and run the workflow.
    - Which package manager you use.
    - How to hit the `/wizards` endpoint once deployed.


---

## **Notes & Guidance**

- Please use your own AWS account for this exercise (the AWS Free Tier is sufficient). Do **not** use company or shared credentials.
- If you cannot deploy, please document what the CDK deploy would do, and provide screenshots or logs from `cdk synth` in your README.
- Don’t spend more than 2 hours—simple and working beats fancy and incomplete!

---

**Show Me What You Got**

![Show Me What You Got](https://media1.tenor.com/m/c3GPoqtlUqEAAAAd/goat-tribe-lfgoat.gif)

---
