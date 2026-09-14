using {bookscapmv4.db as b} from '../db/booksmodelv4';

service BooksLibSrv @(path: '/odata/v4/bookssrv') {
    @odata.draft.enabled
    entity BooksSet   as projection on b.Books;

    entity GenderVH   as projection on b.GenderVH;
    entity AgeGroupVH as projection on b.AgeGroupVH;
}

annotate BooksLibSrv.BooksSet with @(UI: {
    LineItem               : [
        {
            Value: title,
            Label: 'Title'
        },
        {
            Value: author,
            Label: 'Author'
        },
        {
            Value: price,
            Label: 'Price'
        },
        {
            Value: publishedDate,
            Label: 'Published Date'
        },
        {
            Value: gender,
            Label: 'Gender'
        },
        {
            Value: ageGroup,
            Label: 'Age Group'
        },
    ],
    SelectionFields        : [
        title,
        author,
        price,
        publishedDate,
        gender,
        ageGroup
    ],
    HeaderInfo             : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : 'Book',
        TypeNamePlural: 'Books',
        Title         : {Value: title},
        Description   : {Value: author}
    },
    Facets                 : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            Target: '@UI.FieldGroup#General'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Publication Details',
            Target: '@UI.FieldGroup#Publication'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Pricing',
            Target: '@UI.FieldGroup#Pricing'
        }
    ],
    FieldGroup #General    : {
        $Type: 'UI.FieldGroupType',
        Data : [
            {Value: title},
            {Value: author},
            {Value: ageGroup},
            {Value: gender}
        ]
    },
    FieldGroup #Publication: {
        $Type: 'UI.FieldGroupType',
        Data : [{Value: publishedDate}]
    },
    FieldGroup #Pricing    : {
        $Type: 'UI.FieldGroupType',
        Data : [{Value: price}]
    }
});

annotate BooksLibSrv.BooksSet with {
    gender @(Common.ValueList: {
        CollectionPath: 'GenderVH',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: gender,
                ValueListProperty: 'code'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'text'
            }
        ]
    });
    ageGroup @(Common.ValueList: {
        CollectionPath: 'AgeGroupVH',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: ageGroup,
                ValueListProperty: 'code'
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'text'
            }
        ]
    });
}
