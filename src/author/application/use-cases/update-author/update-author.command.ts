export interface UpdateAuthorCommand {
  authorId: string
  data: Partial<{ firstName: string; lastName: string; birthDate: Date }>
}
