## HOW TO RUN

1. have npm/node installed
2. run 'npm install'
3. create cypress.env.json with appropriate github user data 
```json
 {
    "username": "johndoe",
    "password": "strongpassword"
}
```
4. run 'npm run cy:open' or 'npx cypress run'

## INSTRUCTIONS
1. Open https://github.com/login
2. Log In
3. Create a new private repository
4. Create 4 issues in the repository (use paragraphs from API to fill the descriptions - first issue description will be filled with first paragraph, second ...)
5. Delete the repository

API to get 4 paragraphs of random text:
https://baconipsum.com/api/?type=meat&paras=4