import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Brain, Workflow, Lock, Sparkles, FolderOpen } from 'lucide-react';

export default function AIChatbot() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI & Automation Hub</h1>
        <p className="text-muted-foreground">Intelligent tools for smarter vendor management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System AI Chat */}
        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 rounded-2xl bg-primary/10 w-fit mb-3">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-lg">System AI Chatbot</CardTitle>
            <CardDescription>Conversational AI assistant for VMS queries, order tracking, and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-6 bg-muted/30 rounded-xl">
              <Sparkles className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">AI chat interface will be available here</p>
              <p className="text-xs text-muted-foreground mt-1">Ask about orders, inventory, analytics & more</p>
            </div>
            <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30">
              <Lock className="w-3 h-3 mr-1" />Coming in Advanced Phase
            </Badge>
          </CardContent>
        </Card>

        {/* AI Mind / Knowledge Folder */}
        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 rounded-2xl bg-blue-500/10 w-fit mb-3">
              <FolderOpen className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-lg">AI Mind / Knowledge Base</CardTitle>
            <CardDescription>Centralized knowledge folder for AI training, product data, and business rules</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-6 bg-muted/30 rounded-xl space-y-2">
              <Brain className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Upload documents, SOPs, and product catalogs</p>
              <p className="text-xs text-muted-foreground">AI learns from your business context</p>
            </div>
            <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30">
              <Lock className="w-3 h-3 mr-1" />Coming in Advanced Phase
            </Badge>
          </CardContent>
        </Card>

        {/* Agentic AI & Workflow Automation */}
        <Card className="border-dashed border-2">
          <CardHeader className="text-center">
            <div className="mx-auto p-4 rounded-2xl bg-purple-500/10 w-fit mb-3">
              <Workflow className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Agentic AI & Workflows</CardTitle>
            <CardDescription>Automated workflows for inventory alerts, reorder triggers, and smart routing</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-6 bg-muted/30 rounded-xl space-y-2">
              <Workflow className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Define rules and let AI execute workflows</p>
              <p className="text-xs text-muted-foreground">Auto-restock, smart alerts, order routing</p>
            </div>
            <Badge variant="outline" className="bg-amber-500/15 text-amber-600 border-amber-500/30">
              <Lock className="w-3 h-3 mr-1" />Coming in Advanced Phase
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Planned Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>Planned AI Capabilities</CardTitle>
          <CardDescription>Features roadmap for AI integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Smart Order Prediction', desc: 'Predict demand per SKU per portal using historical data' },
              { title: 'Auto SKU Mapping', desc: 'AI-powered matching of marketplace SKUs to master catalog' },
              { title: 'Inventory Optimization', desc: 'Suggest optimal stock levels based on velocity and seasonality' },
              { title: 'Pricing Intelligence', desc: 'Dynamic pricing recommendations across marketplaces' },
              { title: 'Return Pattern Analysis', desc: 'Identify return-prone products and root causes' },
              { title: 'Vendor Performance Scoring', desc: 'AI-generated performance scores and recommendations' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
