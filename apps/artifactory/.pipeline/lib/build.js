'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases = settings.phases
  const options = settings.options
  const oc=new OpenShiftClientX(Object.assign({'namespace':phases.build.namespace}, options));
  const phase='build'
  let objects = []
}