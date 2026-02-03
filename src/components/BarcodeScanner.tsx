import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Scan, Package, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ScanMode = 'order' | 'return';

interface ScanResult {
  barcode: string;
  type: 'order' | 'product' | 'return';
  details: {
    id: string;
    name: string;
    status: string;
    quantity?: number;
  };
}

const mockScanResults: Record<string, ScanResult> = {
  'ORD-2024-001': {
    barcode: 'ORD-2024-001',
    type: 'order',
    details: {
      id: 'ORD-2024-001',
      name: 'Premium Wireless Earbuds Pro',
      status: 'shipped',
      quantity: 1,
    },
  },
  'RET-2024-001': {
    barcode: 'RET-2024-001',
    type: 'return',
    details: {
      id: 'RET-2024-001',
      name: 'Organic Cotton T-Shirt',
      status: 'pending',
      quantity: 1,
    },
  },
  'SKU-AMZ-001': {
    barcode: 'SKU-AMZ-001',
    type: 'product',
    details: {
      id: 'SKU-AMZ-001',
      name: 'Premium Wireless Earbuds Pro',
      status: 'in_stock',
      quantity: 245,
    },
  },
};

interface BarcodeScannerProps {
  mode?: ScanMode;
  trigger?: React.ReactNode;
}

export function BarcodeScanner({ mode = 'order', trigger }: BarcodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState(false);
  const { toast } = useToast();

  const simulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setScanError(false);

    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Randomly select a mock result or error
      const mockBarcodes = Object.keys(mockScanResults);
      const shouldError = Math.random() < 0.2; // 20% chance of error
      
      if (shouldError) {
        setScanError(true);
        toast({
          title: 'Scan Failed',
          description: 'Unable to read barcode. Please try again.',
          variant: 'destructive',
        });
      } else {
        const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
        const result = mockScanResults[randomBarcode];
        setScanResult(result);
        toast({
          title: 'Barcode Scanned',
          description: `Successfully scanned: ${result.barcode}`,
        });
      }
    }, 1500);
  };

  const resetScanner = () => {
    setScanResult(null);
    setScanError(false);
    setIsScanning(false);
  };

  const handleProcess = () => {
    toast({
      title: mode === 'order' ? 'Order Processed' : 'Return Accepted',
      description: `${scanResult?.details.name} has been ${mode === 'order' ? 'processed' : 'accepted for return'}.`,
    });
    setIsOpen(false);
    resetScanner();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetScanner(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Scan className="w-4 h-4" />
            {mode === 'order' ? 'Scan Order' : 'Scan Return'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'order' ? (
              <>
                <Package className="w-5 h-5" />
                Order Barcode Scanner
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5" />
                Return Barcode Scanner
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'order' 
              ? 'Scan order barcode to process shipment'
              : 'Scan return barcode to accept returned items'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Camera View Simulation */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {isScanning ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-48 h-32 border-2 border-primary rounded-lg animate-pulse" />
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-primary animate-[scan_1.5s_ease-in-out_infinite]" />
                    </div>
                  </div>
                  <p className="text-white text-sm">Scanning...</p>
                </div>
              </div>
            ) : scanResult ? (
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>
            ) : scanError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
                <XCircle className="w-16 h-16 text-destructive" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Position barcode in view</p>
                </div>
              </div>
            )}
          </div>

          {/* Scan Result */}
          {scanResult && (
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-mono text-sm text-muted-foreground">{scanResult.barcode}</p>
                    <p className="font-medium">{scanResult.details.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {scanResult.type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          scanResult.details.status === 'in_stock' || scanResult.details.status === 'shipped'
                            ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                        }
                      >
                        {scanResult.details.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {scanResult.details.quantity && (
                      <p className="text-sm text-muted-foreground">
                        Quantity: {scanResult.details.quantity}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!scanResult && !scanError && (
              <Button 
                className="flex-1 gap-2" 
                onClick={simulateScan}
                disabled={isScanning}
              >
                <Scan className="w-4 h-4" />
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </Button>
            )}
            
            {(scanResult || scanError) && (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2" 
                  onClick={resetScanner}
                >
                  <Camera className="w-4 h-4" />
                  Scan Again
                </Button>
                {scanResult && (
                  <Button className="flex-1" onClick={handleProcess}>
                    {mode === 'order' ? 'Process Order' : 'Accept Return'}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-50px); }
          50% { transform: translateY(50px); }
        }
      `}</style>
    </Dialog>
  );
}
