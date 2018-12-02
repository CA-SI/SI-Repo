import $ from 'jquery'
import {chain, pick, omit, filter, defaults} from 'lodash'

import TmplListGroupItem from '../templates/list-group-item'
import {setContent, slugify, createDisciplinaFilters, collapseListGroup} from '../util'

export default class {
  constructor (opts) {
    const teachers = this._teachersWithCount(opts.disciplinas, opts.params)
    const teachersMarkup = teachers.map(TmplListGroupItem)
    setContent(opts.el, teachersMarkup)
    collapseListGroup(opts.el)
  }

  _teachersWithCount (disciplinas, params) {
    return chain(disciplinas)
      .groupBy('teacher')
      .map(function (disciplinasInOrg, teacher) {
        const filters = createDisciplinaFilters(pick(params, ['category']))
        const filteredDisciplinas = filter(disciplinasInOrg, filters)
        const orgSlug = slugify(teacher)
        const selected = params.teacher && params.teacher === orgSlug
        const itemParams = selected ? omit(params, 'teacher') : defaults({teacher: orgSlug}, params)
        return {
          title: teacher,
          url: '?' + $.param(itemParams),
          count: filteredDisciplinas.length,
          unfilteredCount: disciplinasInOrg.length,
          selected: selected
        }
      })
      .orderBy('unfilteredCount', 'desc')
      .value()
  }
}
