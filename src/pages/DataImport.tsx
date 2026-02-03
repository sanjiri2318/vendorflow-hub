import { ExcelUpload } from '@/components/ExcelUpload';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Scan, Package, RotateCcw } from 'lucide-react';

export default function DataImport() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Data Import & Scanning</h1>
        <p className="text-muted-foreground">Upload Excel files or scan barcodes for quick data entry</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileSpreadsheet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Excel Upload</h3>
                <p className="text-sm text-muted-foreground">Bulk import data</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <BarcodeScanner 
              mode="order" 
              trigger={
                <div className="flex items-center gap-4 w-full">
                  <div className="p-3 rounded-lg bg-emerald-500/10">
                    <Package className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Scan Order</h3>
                    <p className="text-sm text-muted-foreground">Process shipments</p>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <BarcodeScanner 
              mode="return" 
              trigger={
                <div className="flex items-center gap-4 w-full">
                  <div className="p-3 rounded-lg bg-amber-500/10">
                    <RotateCcw className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">Scan Return</h3>
                    <p className="text-sm text-muted-foreground">Accept returns</p>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Excel Upload Section */}
      <ExcelUpload />
    </div>
  );
}
