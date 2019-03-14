'use strict';
const {OpenShiftClientX} = require('pipeline-cli')
const path = require('path');

module.exports = (settings)=>{
  const phases = settings.phases
  const options= settings.options
  const phase=options.env
  const changeId = phases[phase].changeId
  const oc=new OpenShiftClientX({'namespace':phases[phase].namespace});
  const templatesLocalBaseUrl =oc.toFileUrl(path.resolve(__dirname, '../../openshift'))
  var objects = []

  /**
   * TODO:
   * 
   * 1. Specify the templates path in processDeploymentTemplate()
   * 2. put in params for the template, values coming from config's phases (see in ./config.js)
   * 3. objects will contain the concatinated value of all processed templates
   * 4. importImageStreams(): For base images, rocketchat is not building any in tools, need to specifiy it in config's build phase
   * 
   *  */
  

  // -------------- Secrets for DB:--------------
  // First call will create/generate default values and a template
  oc.createIfMissing(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/xxx.yaml`, { //update here
    'param':{
      // 'NAME': `template.${phases[phase].name}-monogodb`,
      // 'SUFFIX': '',
    }
  }))

  // Second call will create the required object using their respective template (default ones generated above)
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/xxx.yaml`, {
    'param':{
      // 'NAME': `${phases[phase].name}-monogodb`,
      // 'SUFFIX': phases[phase].suffix,
    }
  }))

  // -------------- Secrets for APP:--------------
  //First call will create/generate default values and a template
  oc.createIfMissing(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/xxx.yaml`, {
    'param':{
      // 'NAME': `template.${phases[phase].name}`,
      // 'SUFFIX': ''
    }
  }))

  //Second call will create the required object using their respective template (default ones generated above)
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/xxx.yaml`, {
    'param':{
      // 'NAME': phases[phase].name,
      // 'SUFFIX': phases[phase].suffix
    }
  }))

  // -------------- Deployment for APP:--------------
  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/xxx.yaml`, {
    'param':{
      // 'NAME': `${phases[phase].name}-monogodb`,
      // 'SUFFIX': phases[phase].suffix,
      // 'INSTANCE': `${phases[phase].name}-monogodb${phases[phase].suffix}`,
    }
  }))

  objects = objects.concat(oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/xxx.yaml`, {
    'param':{
      // 'NAME': phases[phase].name,
      // 'SUFFIX': phases[phase].suffix,
      // 'VERSION': phases[phase].tag,
      // 'DB_SECRET_NAME':`${phases[phase].name}-monogodb${phases[phase].suffix}`,
      // 'DB_SECRET_DATABASE_KEY':'app-db-name',
      // 'DB_SECRET_USERNAME_KEY':'app-db-username',
      // 'DB_SECRET_PASSWORD_KEY':'app-db-password',
      // 'DB_SERVICE_HOST': `${phases[phase].name}-monogodb-master${phases[phase].suffix}`,
      // 'HOST': phases[phase].host
    }
  }))

  // -------------- Any other templates to process?--------------
  // .....

  // -------------- Add lables:--------------
  oc.applyRecommendedLabels(objects, phases[phase].name, phase, `${changeId}`, phases[phase].instance)

  objects.forEach((item)=>{
    oc.copyRecommendedLabels(item.metadata.labels, item.spec.template.metadata.labels)
  })

  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag)

  oc.applyAndDeploy(objects, phases[phase].instance)

}