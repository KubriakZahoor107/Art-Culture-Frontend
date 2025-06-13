import { getRandomNewsProps } from '../src/utils/serverProps'
import { newsList } from '../src/data/news'

test('getServerSideProps returns a news item and timestamp', async () => {
  const { props } = await getRandomNewsProps()
  expect(props.randomNews).toBeDefined()
  expect(newsList.some(n => n.id === props.randomNews.id)).toBe(true)
  expect(typeof props.generatedAt).toBe('string')
})
