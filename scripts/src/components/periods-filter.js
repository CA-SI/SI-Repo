import $ from 'jquery'
import {chain, pick, omit, filter, defaults} from 'lodash'

import TmplListGroupItem from '../templates/list-group-item'
import {setContent, slugify, createSubjectFilters, collapseListGroup} from '../util'

export default class {
  constructor (opts) {
    const periods = this._periodsWithCount(opts.subjects, opts.params)
    const periodsMarkup = periods.map(TmplListGroupItem)
    setContent(opts.el, periodsMarkup)
    collapseListGroup(opts.el)
  }

  // Given an array of subjects, returns an array of their periods with counts
  _periodsWithCount (subjects, params) {
    return chain(subjects)
      .filter('period')
      .flatMap(function (value, index, collection) {
        // Explode objects where period is an array into one object per period
        if (typeof value.period === 'string') return value
        const duplicates = []
        value.period.forEach(function (period) {
          duplicates.push(defaults({period: period}, value))
        })
        return duplicates
      })
      .groupBy('period')
      .map(function (subjectsInCat, period) {
        const filters = createSubjectFilters(pick(params, ['teacher']))
        const filteredSubjects = filter(subjectsInCat, filters)
        const periodSlug = slugify(period)
        const selected = params.period && params.period === periodSlug
        const itemParams = selected ? omit(params, 'period') : defaults({period: periodSlug}, params)
        return {
          title: period,
          url: '?' + $.param(itemParams),
          count: filteredSubjects.length,
          unfilteredCount: subjectsInCat.length,
          selected: selected
        }
      })
      .orderBy('unfilteredCount', 'desc')
      .value()
  }
}
