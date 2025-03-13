# Up and Running the project
- Install `nvm` https://github.com/nvm-sh/nvm#installing-and-updating
- Install node 14: `nvm install 14`
- Install node packages: `npm install`
- Run `npm run dev`


## Updating and publishing library

1. Local `master` branch should include all necessary updates
    - Development branches should be based on `master` branch. PRs are merged to `master`; 
2. Before publish make sure you are using `latest` version of `node`
3. Run `npm run lib:publish` (make sure the `master` branch is selected before running the script)
