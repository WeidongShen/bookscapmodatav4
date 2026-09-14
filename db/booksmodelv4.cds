namespace bookscapmv4.db;

entity GenderVH {
    key code : String(1);
    text : String;
}

entity AgeGroupVH {
    key code : String(1);
    text : String;
}

type AllGender : String enum {
    Male   = 'M';
    Female = 'F';
}

type BooksAgeGroup : String enum {
    Kids   = 'KIDS';
    Adult  = 'ADULT';
}

entity Books {
    key ID        : UUID;
    title         : String(100);
    author        : String(100);
    price         : Decimal(10, 2);
    publishedDate : DateTime;
    gender        : AllGender;
    ageGroup      : BooksAgeGroup;
}