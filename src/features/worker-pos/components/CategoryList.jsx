import { CategoryAccordion } from './CategoryAccordion'

export function CategoryList(props) {
  return (
    <div className="grid gap-3 pb-6">
      {props.categories.map((category) => (
        <CategoryAccordion {...props} category={category} key={category.id} />
      ))}
    </div>
  )
}
