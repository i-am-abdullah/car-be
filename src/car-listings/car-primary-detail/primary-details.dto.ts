 class CreateCarMakeDto {
    name: string;
    image_url?: string;
  }
  
  class CreateCarModelDto {
    name: string;
    image_url?: string;
    makeId: string;
  }
  
  class CreateCarYearDto {
    year: number;
    makeId: string;
    modelId: string;
  }
  
  class CreateCarVariantDto {
    name: string;
    description?: string;
    makeId: string;
    modelId: string;
    yearId: string;
  }
  export {CreateCarMakeDto, CreateCarModelDto, CreateCarYearDto, CreateCarVariantDto}