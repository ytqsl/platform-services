'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '4'
const name = 'artifactory'

const phases = {
  build: {namespace:'devops-artifactory'  , name: `${name}`, phase: 'build', changeId:changeId, suffix: `-build-${changeId}`, instance: `${name}-build-${changeId}`, version:`${version}-${changeId}`, tag:`${version}-${changeId}`},
   dev:  {namespace:'devops-artifactory'  , name: `${name}`, phase: 'dev' , changeId:changeId, suffix: `-dev-${changeId}` , instance: `${name}-dev-${changeId}` , version:`${version}-${changeId}`, tag:`dev-${version}-${changeId}`, host: `artifactory-dev-${changeId}-devops-artifactory.pathfinder.gov.bc.ca`},
   test: {namespace:'devops-artifactory'   , name: `${name}`, phase: 'test' , changeId:changeId, suffix: '-test'          , instance: `${name}-test`             , version:`${version}-${changeId}`, tag:`test-${version}`            , host: 'artifactory-test.pathfinder.gov.bc.ca'},
   prod: {namespace:'devops-artifactory'   , name: `${name}`, phase: 'prod' , changeId:changeId, suffix: '-prod'          , instance: `${name}-prod`             , version:`${version}-${changeId}`, tag:`prod-${version}`            , host: 'artifactory.pathfinder.gov.bc.ca'}
}

process.on('unhandledRejection', (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = {phases, options};