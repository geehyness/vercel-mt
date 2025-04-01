// components/BibleReferenceInput.tsx
import { Stack, Autocomplete, Card } from '@sanity/ui'

export function BibleReferenceInput(props) {
  const { passages } = useClient({apiVersion: '2023-05-31'})
    .fetch(`*[_type == "biblePassage"]{ reference, _id }`)

  return (
    <Stack space={3}>
      <Autocomplete
        options={passages.map(p => ({
          value: p._id,
          title: p.reference
        }))}
        onSelect={id => props.onChange(id)}
      />
      {props.value && (
        <Card padding={3} border radius={2}>
          <p>Selected: {passages.find(p => p._id === props.value)?.reference}</p>
        </Card>
      )}
    </Stack>
  )
}

// Then in your schema:
{
  name: 'biblePassage',
  type: 'reference',
  components: {
    input: BibleReferenceInput
  }
}