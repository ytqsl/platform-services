## Setting up pipeline for rocketchat:

Steps:
- Have all templates ready in the `openshift/`
- Modify the scripts in `./lib` to use the correct openshift templates, changes needed as commented with `TODO:`
- Take the `./Jenkinsfile` content into `pipeline.yaml`


Good to know:
- This pipeline is using the v1 from https://github.com/BCDevOps/pipeline-cli.git#v1.0. When there's update, need to re-install by removing `package-lock.json` and `node_modules/`, then `npm i`
- keep all configs in the `./lib/config.js` for easy management
