# Setup

Clone this repository.

## Update config.xml files

specify `repoOwner` and `repository` in `/docker/contrib/jenkins/configuration/jobs/_jenkins/config.xml` and `/docker/contrib/jenkins/configuration/jobs/app/config.xml`:

```
<org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject ...
  <sources ...
    <data>
      <jenkins.branch.BranchSource>
        <source ...
          <id>generate a new giud</id>
            ...
          <repoOwner>bcgov</repoOwner>
          <repository>GDX-Analytics-OpenShift-Snowplow-Gateway-Service</repository>
```

## Update .jenkins/.pipeline/lib/config.js

to set the deployment phase namespaces according to the appropriate project namespaces

```
const phases = {
  build: {namespace:'e5imao-tools' ...
  dev:   {namespace:'e5imao-dev'   ...
  test:  {namespace:'e5imao-test'  ...
  prod:  {namespace:'e5imao-prod'  ...
```

## oc login
```
#perform oc login (Copy command from web console)
```

# create secrets template
(TODO: what access needed for the access token)
```
oc -n e5imao-tools process -f 'openshift/secrets.json' -p 'GH_USERNAME=<username>' -p 'GH_PASSWORD=<personal_access_token>' | oc  -n e5imao-tools create -f -
```

# Build and Deploy Jenkins locally once for setup
```
cd "$(git rev-parse --show-toplevel)/.jenkins/.pipeline"

npm i

npm run build -- --pr=0 --dev-mode=true
# dev-mode=true makes a binary build from the working directory.

npm run deploy -- --pr=0 --env=prod

npm run clean -- --pr=0
# check in Jenkins PROD log to make sure that there are no Java exceptions logs;
# if there are any, you will have to escalate to devops team.
```

## Grant Admin access to Jenkins Service account in each managed namespace
```
oc -n e5imao-dev policy add-role-to-user 'admin' 'system:serviceaccount:e5imao-tools:jenkins-prod'
oc -n e5imao-test policy add-role-to-user 'admin' 'system:serviceaccount:e5imao-tools:jenkins-prod'
oc -n e5imao-prod policy add-role-to-user 'admin' 'system:serviceaccount:e5imao-tools:jenkins-prod'
oc -n e5imao-tools policy add-role-to-group 'system:image-puller' 'system:serviceaccounts:e5imao-dev' 'system:serviceaccounts:e5imao-test' 'system:serviceaccounts:e5imao-prod'
```

## For local development purposes

### Build
```
( cd "$(git rev-parse --show-toplevel)" && .jenkins/.pipeline/npmw build -- --pr=0 )
```

### Deploy
```
( cd "$(git rev-parse --show-toplevel)" && .jenkins/.pipeline/npmw deploy -- --pr=0 --env=dev )
```

### Cleanup
```
( cd "$(git rev-parse --show-toplevel)" && .jenkins/pipeline-cli clean -- --pr=0 --env=dev )
```
