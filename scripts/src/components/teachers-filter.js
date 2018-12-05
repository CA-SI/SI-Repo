import $ from 'jquery'
import {chain, pick, omit, filter, defaults} from 'lodash'

import TmplListGroupItem from '../templates/list-group-item'
import {setContent, slugify, createSubjectFilters, collapseListGroup} from '../util'

export default class {
  constructor (opts) {
    const teachers = this._teachersWithCount(opts.subjects, opts.params)
    const teachersMarkup = teachers.map(TmplListGroupItem)
    setContent(opts.el, teachersMarkup)
    collapseListGroup(opts.el)
  }

  _teachersWithCount (subjects, params) {
    return chain(subjects)
      .groupBy('teacher')
      .map(function (subjectsInOrg, teacher) {
        const filters = createSubjectFilters(pick(params, ['category']))
        const filteredSubjects = filter(subjectsInOrg, filters)
        const orgSlug = slugify(teacher)
        const selected = params.teacher && params.teacher === orgSlug
        const itemParams = selected ? omit(params, 'teacher') : defaults({teacher: orgSlug}, params)
        return {
          title: teacher,
          url: '?' + $.param(itemParams),
          count: filteredSubjects.length,
          unfilteredCount: subjectsInOrg.length,
          selected: selected
        }
      })
      .orderBy('unfilteredCount', 'desc')
      .value()
  }
}
