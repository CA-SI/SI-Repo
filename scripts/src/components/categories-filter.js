import $ from 'jquery'
import {chain, pick, omit, filter, defaults} from 'lodash'

import TmplListGroupItem from '../templates/list-group-item'
import {setContent, slugify, createDisciplinaFilters, collapseListGroup} from '../util'

export default class {
  constructor (opts) {
    const categories = this._categoriesWithCount(opts.disciplinas, opts.params)
    const categoriesMarkup = categories.map(TmplListGroupItem)
    setContent(opts.el, categoriesMarkup)
    collapseListGroup(opts.el)
  }

  // Given an array of disciplinas, returns an array of their categories with counts
  _categoriesWithCount (disciplinas, params) {
    return chain(disciplinas)
      .filter('category')
      .flatMap(function (value, index, collection) {
        // Explode objects where category is an array into one object per category
        if (typeof value.category === 'string') return value
        const duplicates = []
        value.category.forEach(function (category) {
          duplicates.push(defaults({category: category}, value))
        })
        return duplicates
      })
      .groupBy('category')
      .map(function (disciplinasInCat, category) {
        const filters = createDisciplinaFilters(pick(params, ['teacher']))
        const filteredDisciplinas = filter(disciplinasInCat, filters)
        const categorySlug = slugify(category)
        const selected = params.category && params.category === categorySlug
        const itemParams = selected ? omit(params, 'category') : defaults({category: categorySlug}, params)
        return {
          title: category,
          url: '?' + $.param(itemParams),
          count: filteredDisciplinas.length,
          unfilteredCount: disciplinasInCat.length,
          selected: selected
        }
      })
      .orderBy('unfilteredCount', 'desc')
      .value()
  }
}
