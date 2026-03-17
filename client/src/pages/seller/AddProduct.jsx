import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Info, 
  Settings, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Save, 
  ChevronRight, 
  ChevronLeft,
  Cpu,
  Zap,
  Shield,
  Layers
} from 'lucide-react';
import SellerLayout from '../../components/seller/SellerLayout';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    images: [],
    specs: {
      latency: '',
      clockSpeed: '',
      batteryLife: '',
      portType: 'Neural Link'
    },
    features: []
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, { name: '', description: '' }]
    }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Neural Listing Initialized!', {
      style: {
        background: '#ffffff',
        color: '#111827',
        border: '1px solid #10ced1'
      }
    });
    console.log('Final Data:', formData);
  };

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto mb-20">
        <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="p-3 bg-accent-primary text-white rounded-2xl shadow-lg">
                 <Plus size={24} />
              </span>
              <div>
                 <h1 className="text-text-main text-4xl font-display italic font-bold">Initialize Listing.</h1>
                 <p className="text-text-muted text-sm font-body">Craft a high-performance entry for the Aether marketplace network.</p>
              </div>
            </div>
           
           {/* Progress Bar */}
           <div className="flex items-center gap-4 mt-8">
              {[1, 2, 3].map((i) => (
                 <React.Fragment key={i}>
                    <div className={`flex items-center gap-2 ${step >= i ? 'text-accent-primary shadow-sm' : 'text-text-dim'}`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${step >= i ? 'border-accent-primary bg-accent-primary text-white' : 'border-border-main bg-bg-surface'}`}>
                          {i}
                       </div>
                       <span className={`font-mono text-[10px] uppercase tracking-widest hidden sm:inline ${step >= i ? 'text-text-main font-bold' : 'text-text-dim'}`}>
                          {i === 1 ? 'Core Data' : i === 2 ? 'Neuro Specs' : 'Preview'}
                       </span>
                    </div>
                    {i < 3 && <div className={`flex-1 h-[2px] rounded-full ${step > i ? 'bg-accent-primary' : 'bg-border-main'}`} />}
                 </React.Fragment>
              ))}
           </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
           <AnimatePresence mode="wait">
              {step === 1 && (
                 <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                 >
                    <div className="bg-bg-elevated p-10 rounded-[2.5rem] border border-border-main space-y-6 shadow-xl">
                       <div className="flex items-center gap-2 mb-4 text-accent-primary">
                          <Package size={18} />
                          <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-bold">Identity & Logistics</h3>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Product Name</label>
                             <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Synapse-X Core Link"
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-body outline-none focus:border-accent-primary transition-colors focus:shadow-md"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Manufacturer / Brand</label>
                             <input 
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                placeholder="e.g. Neural Core Labs"
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-body outline-none focus:border-accent-primary transition-colors focus:shadow-md"
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Unit Price (USD)</label>
                             <input 
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="2499"
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-mono outline-none focus:border-accent-primary transition-colors"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Initial Stock</label>
                             <input 
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                placeholder="100"
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-mono outline-none focus:border-accent-primary transition-colors"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Category</label>
                             <select 
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-body outline-none focus:border-accent-primary transition-colors"
                             >
                                <option>Electronics</option>
                                <option>Neural Augments</option>
                                <option>Bio-Hardware</option>
                                <option>Wearables</option>
                             </select>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Full Bio-Description</label>
                          <textarea 
                             name="description"
                             value={formData.description}
                             onChange={handleInputChange}
                             placeholder="Detail the technical superiority and neural compatibility..."
                             rows={4}
                             className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-body outline-none focus:border-accent-primary transition-colors resize-none"
                          />
                       </div>
                    </div>
                 </motion.div>
              )}

              {step === 2 && (
                 <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                 >
                    <div className="bg-bg-elevated p-10 rounded-[2.5rem] border border-border-main space-y-6 shadow-xl">
                       <div className="flex items-center gap-2 mb-4 text-accent-secondary">
                          <Cpu size={18} />
                          <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-bold">Electronics & Performance Specs</h3>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2">Processing Latency (ms)</label>
                             <input 
                                type="text"
                                name="specs.latency"
                                value={formData.specs.latency}
                                onChange={handleInputChange}
                                placeholder="e.g. 0.002ms"
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-mono outline-none focus:border-accent-primary transition-colors"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Clock Speed (THz)</label>
                             <input 
                                type="text"
                                name="specs.clockSpeed"
                                value={formData.specs.clockSpeed}
                                onChange={handleInputChange}
                                placeholder="e.g. 8.4 THz"
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-mono outline-none focus:border-accent-primary transition-colors"
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Nexus Connectivity</label>
                             <select 
                                name="specs.portType"
                                value={formData.specs.portType}
                                onChange={handleInputChange}
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-body outline-none focus:border-accent-primary transition-colors"
                             >
                                <option>Neural Link</option>
                                <option>Wireless Uplink</option>
                                <option>Direct Bio-Port</option>
                                <option>USB-C 8.0</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Energy Endurance</label>
                             <input 
                                type="text"
                                name="specs.batteryLife"
                                value={formData.specs.batteryLife}
                                onChange={handleInputChange}
                                placeholder="e.g. 72 Cycles"
                                className="w-full bg-bg-surface border border-border-main rounded-2xl px-6 py-4 text-text-main font-mono outline-none focus:border-accent-primary transition-colors"
                             />
                          </div>
                       </div>

                       <div className="pt-8 space-y-4">
                          <label className="font-mono text-[10px] uppercase tracking-widest text-text-dim ml-2 font-bold">Advanced Features List</label>
                          {formData.features.map((feature, idx) => (
                             <motion.div 
                                key={idx}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex gap-4 p-4 bg-bg-surface rounded-2xl border border-border-main group shadow-sm"
                             >
                                <div className="flex-1 space-y-4">
                                   <input 
                                      type="text"
                                      placeholder="Feature Title"
                                      value={feature.name}
                                      onChange={(e) => {
                                         const newFeatures = [...formData.features];
                                         newFeatures[idx].name = e.target.value;
                                         setFormData(prev => ({ ...prev, features: newFeatures }));
                                      }}
                                      className="w-full bg-transparent border-none p-0 text-text-main font-bold outline-none placeholder:text-text-dim"
                                   />
                                   <input 
                                      type="text"
                                      placeholder="Brief technical detail..."
                                      value={feature.description}
                                      onChange={(e) => {
                                         const newFeatures = [...formData.features];
                                         newFeatures[idx].description = e.target.value;
                                         setFormData(prev => ({ ...prev, features: newFeatures }));
                                      }}
                                      className="w-full bg-transparent border-none p-0 text-text-muted text-sm outline-none placeholder:text-text-dim"
                                   />
                                </div>
                                <button 
                                   type="button"
                                   onClick={() => removeFeature(idx)}
                                   className="text-text-dim hover:text-red-500 transition-colors"
                                >
                                   <Trash2 size={18} />
                                </button>
                             </motion.div>
                          ))}
                          <button 
                             type="button"
                             onClick={addFeature}
                             className="w-full py-4 border border-dashed border-border-main rounded-2xl text-text-muted font-mono text-[10px] uppercase tracking-widest hover:border-accent-primary hover:text-accent-primary transition-all flex items-center justify-center gap-2"
                          >
                             <Plus size={14} /> Add Advanced Feature
                          </button>
                       </div>
                    </div>
                 </motion.div>
              )}

              {step === 3 && (
                 <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                 >
                    <div className="bg-bg-elevated p-10 rounded-[2.5rem] border border-border-main shadow-xl">
                         <div className="flex items-center gap-2 mb-8 text-accent-success">
                            <Shield size={18} />
                            <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-bold">Final Review & Verification</h3>
                         </div>

                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                               <div>
                                  <span className="text-text-dim font-mono text-[8px] uppercase tracking-widest">Product Title</span>
                                  <h4 className="text-text-main text-2xl font-display italic font-bold">{formData.name || 'Untitled Entry'}</h4>
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <span className="text-text-dim font-mono text-[8px] uppercase tracking-widest">Market Value</span>
                                     <p className="text-accent-primary font-mono">${formData.price || '0'}</p>
                                  </div>
                                  <div>
                                     <span className="text-text-dim font-mono text-[8px] uppercase tracking-widest">Inventory Stack</span>
                                     <p className="text-text-main font-mono">{formData.stock || '0'} Units</p>
                                  </div>
                               </div>
                               <div>
                                  <span className="text-text-dim font-mono text-[8px] uppercase tracking-widest">Neuro Compatibility</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                     <span className="px-3 py-1 bg-bg-surface rounded-full text-accent-secondary font-mono text-[10px] uppercase border border-border-main">{formData.specs.latency || 'N/A Latency'}</span>
                                     <span className="px-3 py-1 bg-bg-surface rounded-full text-accent-primary font-mono text-[10px] uppercase border border-border-main">{formData.specs.clockSpeed || 'N/A THz'}</span>
                                     <span className="px-3 py-1 bg-bg-surface rounded-full text-text-dim font-mono text-[10px] uppercase border border-border-main">{formData.specs.portType}</span>
                                  </div>
                               </div>
                            </div>

                            <div className="bg-bg-surface rounded-3xl p-6 border border-border-main relative flex items-center justify-center min-h-[200px] group cursor-pointer shadow-inner">
                               <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                               <div className="text-center">
                                  <ImageIcon size={40} className="text-text-dim mb-4 mx-auto" />
                                  <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">Neural Blueprint Visual Required.</p>
                                  <p className="text-[8px] text-text-dim font-body mt-2">Maximum file weight: 12MB</p>
                               </div>
                            </div>
                         </div>

                         <div className="mt-12 p-6 rounded-2xl bg-accent-warning/5 border border-accent-warning/20">
                            <p className="text-[10px] text-accent-warning font-mono uppercase tracking-widest mb-1 font-bold italic">Warning</p>
                            <p className="font-body text-xs text-text-muted leading-relaxed">
                               By initializing this listing, you confirm that this hardware meets the Section 9 Neural Integrity standards. Automated compliance sync and price verification will occur upon submission.
                            </p>
                         </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>

           <div className="flex items-center justify-between gap-4">
              {step > 1 && (
                 <button 
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-4 bg-bg-surface text-text-main rounded-2xl font-mono text-[10px] uppercase tracking-widest border border-border-main hover:bg-bg-secondary transition-colors flex items-center gap-2 shadow-sm"
                 >
                    <ChevronLeft size={14} /> Neural Retreat
                 </button>
              )}
              
              <div className="flex-1" />

              {step < 3 ? (
                 <button 
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-4 bg-accent-primary text-white rounded-2xl font-mono text-[10px] uppercase tracking-widest font-black hover:bg-text-main transition-colors flex items-center gap-2 shadow-xl"
                 >
                    Next Logic Layer <ChevronRight size={14} />
                 </button>
              ) : (
                 <button 
                    type="submit"
                    className="px-12 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] font-black hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl"
                 >
                    <Save size={14} /> Finalize Listing Uplink
                 </button>
              )}
           </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default AddProduct;
