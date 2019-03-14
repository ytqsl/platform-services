'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases = settings.phases
  const oc=new OpenShiftClientX({'namespace':phases.build.namespace});
  const phase='build'
  let objects = []
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))

  // TODO: since there are no builds needed, need to customize/remove this script:
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/xxx.yaml`, {
    'param':{
      // 'NAME': phases[phase].name,
      // 'SUFFIX': phases[phase].suffix,
      // 'VERSION': phases[phase].tag,
      // 'SOURCE_GIT_URL': oc.git.http_url,
      // 'SOURCE_GIT_REF': oc.git.ref
    }
  }))

  oc.applyRecommendedLabels(objects, phases[phase].name, phase, phases[phase].changeId, phases[phase].instance)
  oc.applyAndBuild(objects)
}