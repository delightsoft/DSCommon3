Result = require '../../result'

{invalidArg, tooManyArgs, isResult} = require '../../utils/_err'

isObject = (v) -> typeof v == 'object' and v != null and not Array.isArray(v)

$$vueDebugWatchBuilderBuilder = (fieldsDesc) ->

  buildLevel = (result, levelDesc, fields) ->

    name = checks = undefined

    result.context ((path) -> (Result.prop name) path), ->

      checks = for fieldDesc in levelDesc.$$list when ~['structure', 'subtable'].indexOf(fieldDesc.type)

        name = fieldDesc.name

        do (fieldDesc, name) ->

          if fieldDesc.type == 'structure'

            if isObject (prevValue = fields[name])

              check = buildLevel result, fieldDesc.fields, prevValue

            else

              result.warn Result.prop(name), 'missing', value: prevValue if check

            (result, newFields) ->

              v = newFields[name]

              result.context Result.prop(name), ->

                if check && prevValue == v

                  check result, v

                else if isObject v

                  result.warn if check then 'changed' else 'added'

                  check = buildLevel result, fieldDesc.fields, v

                else

                  result.warn 'removed', value: v if check

                  check = undefined

                prevValue = newFields[name]

                return

              return # (result, newFields) ->

          else


            prevArr = fields[name]

            if Array.isArray fields[name]

              check = (buildLevel result, fieldDesc.fields, row for row in fields[name])

              prevValue = fields[name].slice()

            else

              result.warn Result.prop(name), 'missing', value: prevValue if check

            (result, newFields) ->

              unless check

                if Array.isArray fields[name]

                  check = (buildLevel result, fieldDesc.fields, row for row in fields[name])

                  prevValue = newFields[name].slice()

                  prevArr = newFields[name]

                  result.warn 'added'

              else if not Array.isArray newFields[name]

                check = undefined

                result.warn 'removed', value: newFields[name]

              else if prevArr != newFields[name]

                result.warn Result.prop(name), 'changed'

                check = (buildLevel result, fieldDesc.fields, row for row in fields[name])

                prevValue = fields[name].slice()

                prevArr = fields[name]

              else

                i = undefined

                result.context ((path) -> (Result.index i, Result.prop name) path), ->

                  for row, i in newFields[name]

                    if i >= prevValue.length

                      result.warn 'added'

                      check.push buildLevel result, fieldDesc.fields, row

                    else if prevValue[i] != row

                      result.warn 'changed'

                      check[i] = buildLevel result, fieldDesc.fields, row

                    else

                      check[i] result, row

                  if i < prevValue.length

                    for i in [i...prevValue.length]

                      result.warn 'removed'

                prevValue = newFields[name].slice()

                prevArr = newFields[name]

                check.length = prevValue.length

              return

    (result, newFields) -> # (result, desc, fields) ->

      check(result, newFields) for check in checks

      return

  (propName) ->

    invalidArg 'propName', propName unless typeof propName == 'string'
    tooManyArgs() unless arguments.length <= 2

    check = undefined

    (result, value) ->

      # todo: check value totally changed

      unless isResult result
        value = result
        newResult = true
        result = new Result()

      result.context Result.prop(propName), ->

        if not check

          result.context (Result.prop propName), ->

          check = buildLevel result, fieldsDesc, value

        else

          check result, value

          if newResult

            console.warn "#{row.path}: #{message}" for row in result.messages

        return

      return # (result, value) ->

# ----------------------------

module.exports = $$vueDebugWatchBuilderBuilder
