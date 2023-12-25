import { Array2Dict } from '../../src/utils/parses'
import { expect, it } from 'vitest'
import ChinaCity from '../../src/packages/CitySelect/data'


it('Array2Dict', () => {
  expect(Array2Dict(ChinaCity[0], {
    key: 'name'
  })).toMatchSnapshot()
})

