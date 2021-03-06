Типы полей документов объявляемые пользователем
------------------------------

    Result = require('../src/result')

    processUdtypes = require('../src/config/_processUdtypes')

    processUdtypeFields = require('../src/config/_processUdtypeFields')

    compile = require('../src/config/_compile')

    deepClone = require('../src/utils/_deepClone')

    focusOnCheck = ''
    check = (itName, itBody) -> (if focusOnCheck == itName then fit else it) itName, itBody; return
    xcheck = (itName, itBody) -> return

    describe '052_config_udtypes_struct:', ->

      check 'general', ->

        _config =

          udtypes:

            email: type: 'string(20)'

            type1: fields:
              a: type: 'int'
              b: type: 'string(20)'

            type2: type: 'type1', fields:
              c: type: 'int'
              d: type: 'string(20)'

            type3: type: 'type1'

            type4:
              type: 'subtable'
              fields:
                x: type: 'email', required: true
                y: type: 'type3'

          docs:

            Doc1:

              fields:
                f: type: 'type2', null: true, required: true
                h: type: 'type2', null: false, required: false
                i: type: 'type2', null: true, required: false
                p: type: 'type4', null: true, required: true

        config = $$src: deepClone _config

        processUdtypes (result = new Result), config

        processUdtypeFields result, config

        expect(result.messages).toEqual []

        expect(config.udtypes.type1).toEqual
          name: 'type1'
          type: 'structure'
          fields:
            a: a = name: 'a', type: 'integer', $$src: {type: 'int'}
            b: b = name: 'b', type: 'string', length: 20, $$src: {type: 'string(20)'}
            $$list: [a, b]

        expect(config.udtypes.type2).toEqual
          name: 'type2'
          type: 'structure'
          udType: 'type1',
          fields:
            c: c = name: 'c', type: 'integer', $$src: {type: 'int'}
            d: d = name: 'd', type: 'string', length: 20, $$src: {type: 'string(20)'}
            $$list: [c, d]

        expect(config.udtypes.type3).toEqual
          name: 'type3'
          type: 'structure'
          udType: 'type1',
          fields:
            a: a = name: 'a', type: 'integer', $$src: {type: 'int'}
            b: b = name: 'b', type: 'string', length: 20, $$src: {type: 'string(20)'}
            $$list: [a, b]

        config = deepClone _config

        res = compile (result = new Result), config, true
        res = compile result, config, true

        expect(result.messages).toEqual []

        expect(res.docs['doc.Doc1'].fields.p.required).toBe true

        expect(res.docs['doc.Doc1'].fields.p.null).toBe true

        expect(res.docs['doc.Doc1'].fields.p.$$mask.valueOf()).toEqual [10, 11, 12, 13]

        expect(res.docs['doc.Doc1'].fields.p.fields.y.$$mask.valueOf()).toEqual [12, 13]

        expect(res.docs['doc.Doc1'].fields.p.fields.x.required).toBe true

        expect(res.docs['doc.Doc1'].fields.p.fields.x.null).toBe undefined

        expect(res.docs['doc.Doc1'].fields.$$flat['p.y.b']).toBe res.docs['doc.Doc1'].fields.p.fields.y.fields.b

    check 'cycled', ->

      _config =

        udtypes:

          type3: fields:
            e: type: 'type1'
            f: fields:
              g: type: 'type2'

          type2: fields: [
            name: 'c', type: 'int'
            name: 'd', type: 'type3'
          ]

          type1: fields:
            a: type: 'type2'
            b: type: 'string(20)'

      config = $$src: deepClone _config

      processUdtypes (result = new Result), config

      processUdtypeFields result, config

      expect(result.messages).toEqual [
        {type: 'error', path: 'udtypes.type3.fields.e.fields.a.fields.d', code: 'dsc.cycledUdtypes', value: ['type3', 'type1', 'type2']}
        {type: 'error', path: 'udtypes.type3.fields.f.fields.g.fields.d', code: 'dsc.cycledUdtypes', value: ['type3', 'type2']}
      ]
