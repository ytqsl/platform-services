'use strict';
const options= require('pipeline-cli').Util.parseArguments()
const changeId = options.pr //aka pull-request
const version = '1.1.0'
const name = 'sso'

// TODO: update the param values here for different envs
const phases = {
  build: {namespace:'e5imao-tools'  , name: `${name}`, phase: 'build', changeId:changeId, suffix: `-build-${changeId}`, instance: `${name}-build-${changeId}`, version:`${version}-${changeId}`, tag:`${version}-${changeId}`},
    dev: {namespace:'e5imao-dev'    , name: `${name}`, phase: 'dev'  , changeId:changeId, suffix: '-dev'              , instance: `${name}-dev`              , version:`${version}-${changeId}`, tag:`dev-${version}`             , host: 'chat-dev.pathfinder.gov.bc.ca'},
   test: {namespace:'e5imao-test'   , name: `${name}`, phase: 'test' , changeId:changeId, suffix: '-test'             , instance: `${name}-test`             , version:`${version}-${changeId}`, tag:`test-${version}`            , host: 'chat-test.pathfinder.gov.bc.ca'},
   prod: {namespace:'e5imao-prod'   , name: `${name}`, phase: 'prod' , changeId:changeId, suffix: '-prod'             , instance: `${name}-prod`             , version:`${version}-${changeId}`, tag:`prod-${version}`            , host: 'chat.pathfinder.gov.bc.ca'}
}

module.exports = exports = phases
