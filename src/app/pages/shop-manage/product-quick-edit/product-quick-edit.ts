import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';
import { PRODUCT_QUICK_EDIT_IMPORTS } from './product-quick-edit-import';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderItem } from '@shared/models/group-buy-common.model';

@Component({
  selector: 'app-product-quick-edit',
  imports: [SHARED_IMPORTS, PRODUCT_QUICK_EDIT_IMPORTS],
  templateUrl: './product-quick-edit.html',
  styleUrl: './product-quick-edit.scss',
})
export class ProductQuickEditComponent {

  /** DI */
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  productForm: FormGroup;

  constructor() { }

  ngOnInit() {
    const { sId, product } = this.config.data;
    
    this.productForm = this.fb.group({
      sId: [sId || ''],
      pId: [product?.pId || ''],
      productName: [product?.productName || '', [Validators.required]],
      price: [product?.price || 0, [Validators.required, Validators.min(0)]],
      note: [product?.note || ''],
      imageUrl: [product?.imageUrl || ''],
      isAvailable: [product ? !product.disabled : true]
    });
  }

  /** 檢查欄位是否無效 (用於樣式控制) */
  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // 將圖片轉為 Base64 存入 Form 控制項以供預覽
        this.productForm.patchValue({ imageUrl: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.productForm.patchValue({ imageUrl: '' });
  }

  onSave() {
    if (this.productForm.valid) {
      const rawValue = this.productForm.getRawValue();

      const sId: string = rawValue.sId;

      const updatedProduct: OrderItem = {
        pId: rawValue.pId,
        productName: rawValue.productName,
        price: rawValue.price,
        note: rawValue.note,
        imageUrl: rawValue.imageUrl,
        // 將 UI 的 true (供應中) 轉為數據的 false (disabled)
        disabled: !rawValue.isAvailable 
      };

      // 3. 回傳 sId 與 updatedProduct
      this.ref.close({ sId, product: updatedProduct });
    }
  }

  onCancel() {
    this.ref.close();
  }

}
