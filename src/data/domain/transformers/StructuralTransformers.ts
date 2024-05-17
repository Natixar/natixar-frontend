import { IdTreeNode, IndexOf } from "../types/structures/StructuralTypes"

export function extractHierarchyOf<T>(
  indexOfValues: IndexOf<T>,
  idFunc: (t: T) => number,
  parentFunc: (t: T) => number | undefined,
): IdTreeNode[] {
  if (Object.keys(indexOfValues).length === 0) {
    return []
  }

  const indexOfTreeNodes: IndexOf<IdTreeNode> = {}
  Object.values(indexOfValues).forEach((v) => {
    const id = idFunc(v)
    const node: IdTreeNode = {
      value: id,
      children: [],
    }
    indexOfTreeNodes[id] = node
  })

  const rootIds = new Set(
    Object.keys(indexOfValues).map((id) => parseInt(id, 10)),
  )
  Object.values(indexOfTreeNodes).forEach((node) => {
    const myArea = indexOfValues[node.value]
    const parentId = parentFunc(myArea)
    if (parentId) {
      const myParentNode = indexOfTreeNodes[parentId]
      myParentNode.children.push(node)
      rootIds.delete(idFunc(myArea))
    }
  })

  return Object.values(indexOfTreeNodes).filter((node) =>
    rootIds.has(node.value),
  )
}

export const extractIdsOfIndex = (index: IndexOf<any>): number[] =>
  Object.keys(index).map((idStr) => parseInt(idStr, 10))

export const findTreeNode = (
  id: number,
  nodes: IdTreeNode[],
): IdTreeNode | undefined => {
  let nodeFound = nodes.find((node) => node.value === id)
  if (!nodeFound) {
    for (let i = 0; !nodeFound && i < nodes.length; i += 1) {
      nodeFound = findTreeNode(id, nodes[i].children)
    }
  }
  return nodeFound
}

export const selectExpandedSubTree = (
  nodes: IdTreeNode[],
  addId: (id: number) => boolean,
) => {
  nodes.forEach((node) => {
    if (addId(node.value)) {
      selectExpandedSubTree(node.children, addId)
    }
  })
}

export const expandId = (ids: number[], nodes: IdTreeNode[]): number[] => {
  if (ids.length === 0 || nodes.length === 0) {
    return []
  }

  const foundNodes: IdTreeNode[] = ids
    .map((id) => findTreeNode(id, nodes))
    .filter((node): node is IdTreeNode => !!node)
  if (foundNodes.length === 0) {
    return []
  }

  const result: number[] = []
  const addIdToResult = (id: number) => {
    if (result.includes(id)) {
      return false
    }
    result.push(id)
    return true
  }

  // TODO This should never be necessary because the data points directly
  //      reference categories, but was added because Upstream and Downstream
  //      are mistakenly identified as categories.
  selectExpandedSubTree(foundNodes, addIdToResult)
  return result
}

export function findNodeBy<T>(
  criteria: (t: T) => boolean,
  idIndex: IndexOf<T>,
  hierarchy: IdTreeNode[],
): IdTreeNode | undefined {
  if (hierarchy.length === 0) {
    return undefined
  }
  const onCurrentLevel = hierarchy.find((node) => criteria(idIndex[node.value]))

  if (typeof onCurrentLevel !== "undefined") {
    return onCurrentLevel
  }

  let onLevelBelow: IdTreeNode | undefined
  for (let i = 0; !onLevelBelow && i < hierarchy.length; i += 1) {
    onLevelBelow = findNodeBy(criteria, idIndex, hierarchy[i].children)
  }

  return onLevelBelow
}
