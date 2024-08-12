import React, { Children, isValidElement, ComponentType } from 'react'

const getMatchingChildren = (children: React.ReactNode, displayName: string) =>
  Children.toArray(children).filter(
    (child) => isValidElement(child) && displayName === (child.type as ComponentType<any>).displayName,
  )

export default getMatchingChildren
