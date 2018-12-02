export default (data) => (
`<disciplina>
  <h3><a href="${data.url}">${data.title}</a></h3>
  ${data.notes || ''}
</disciplina>`
)
