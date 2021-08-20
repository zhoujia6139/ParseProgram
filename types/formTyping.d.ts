// Keep this same with frontend folder
declare namespace FormFormat {
  interface FormParam {
    type: string;
    name: string;
    displayName?: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    rows?: number; // textarea only
    initialValue?: any;
    baseSection?: FormParam[];
    options?: SelectOption[];
    isFull?: boolean;
  }
  interface SelectionOption {
    title: string;
    description: string;
    controller: string;
    method: string;
    params: FormFormat.FormParam[];
  }

  interface SelectOption {
    label: string;
    value: string;
  }
}
