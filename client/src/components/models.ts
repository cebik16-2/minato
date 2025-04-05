// src/components/models.ts

export interface Todo {
  id: number
  title: string
  done: boolean
}

export interface Meta {
  totalCount: number
}

export interface EssentialLinkProps {
  title: string
  caption?: string
  link?: string
  icon?: string
}

export interface EssentialLink {
  title: string
  caption?: string
  link?: string
  icon?: string
}

export interface EssentialLinkGroup {
  title: string
  links: EssentialLink[]
}
