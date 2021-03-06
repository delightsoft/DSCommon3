{checkAPIName} = require '../utils'

Result = require '../result'

sortedMap = require '../sortedMap'

bitArray = require '../bitArray'

processFields = require './_processFields'

copyExtra = require './_copyExtra'

{compile: compileTags} = require '../tags'

processAPI = (result, config, noSystemItems) ->

  unless config.$$src.api

    return

  result.context (Result.prop 'api'), -> # processDocs =

    res = sortedMap result, config.$$src.api, checkName: checkAPIName

    unless result.isError

      api = undefined

      result.context ((path) -> (Result.prop api.name) path), ->

        for api in res.$$list

          unless api.$$src?.hasOwnProperty('methods')

            result.warn 'missingProp', value: 'methods'

          else

            result.context ((path) -> (Result.prop 'methods') path), ->

              api.methods = sortedMap result, api.$$src.methods

              unless result.isError

                method = undefined

                result.context ((path) -> (Result.prop method.name) path), ->

                  for method in api.methods.$$list

                    for prop in ['arguments', 'result']

                      unless method.$$src?.hasOwnProperty(prop)

                        method[prop] = {}

                      else

                        method[prop] = processFields result, method, config, prop, true

                  return # result.context

                copyExtra result, api.methods

                # rule: api.methods.$$list is sorted in alphabetical order of their names
                api.methods.$$list.sort (left, right) -> left.name.localeCompare right.name

                sortedMap.index result, api.methods, mask: true

                compileTags result, api.methods

                sortedMap.finish result, api.methods, skipProps: ['tags']

              return # result.context

        return # result.context

      copyExtra result, res

      # rule: api.$$list is sorted in alphabetical order of their names
      res.$$list.sort (left, right) -> left.name.localeCompare right.name

      sortedMap.index result, res

      return if result.isError

      compileTags result, res

      return if result.isError

      sortedMap.finish result, res

      return if result.isError

      config.api = res unless result.isError

      return # processDocs = (result, config) ->

# ----------------------------

module.exports = processAPI
