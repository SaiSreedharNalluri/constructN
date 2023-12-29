export const mockData = [
  {
    id: 'p1',
    name: 'Parent',
    isSelected: false,
  },
  {
    id: 'p2',
    name: 'Parent1',
    isSelected: false,
    children: [
      {
        id: 'c21',
        isSelected: false,
        name: 'Child - 1',
      },
      {
        id: 'c22',
        name: 'Child - 2',
        isSelected: false,
      },
      {
        id: 'c23',
        name: 'Child - 3',
        isSelected: false,
        children: [
          {
            id: 'cc231',
            name: 'Child - 4',
            isSelected: false,
          },
          {
            id: 'cc232',
            name: 'Child - 5',
            isSelected: false,
          },
          {
            id: 'cc233',
            name: 'Child - 6',
            isSelected: false,
            children: [
              {
                id: 'ccc2331',
                name: 'Child - 7',
                isSelected: false,
              },
              {
                id: 'ccc2332',
                name: 'Child - 8',
                isSelected: false,
              },
              {
                id: 'ccc2333',
                name: 'Child - 9',
                isSelected: false,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'p3',
    name: 'Parent3',
    isSelected: false,
  },
]
