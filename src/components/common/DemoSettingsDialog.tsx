import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // optional classNames helper
import { Settings, AppWindow, X, Monitor, Moon, Globe, Github, ShieldCheck } from "lucide-react";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import VerticalDivider from "@/components/common/VerticalDivider";

type PanelKey = "general" | "appearance" | "language" | "security" | "about";

const SIDEBAR = [
  { key: "general", icon: Settings, label: "常规" },
  { key: "appearance", icon: Monitor, label: "外观" },
  { key: "language", icon: Globe, label: "语言" },
  { key: "security", icon: ShieldCheck, label: "安全" },
  { key: "about", icon: Github, label: "关于" },
] as const;

export default function DemoSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<PanelKey>("general");
  const [accent, setAccent] = useState("default"); // 示例重点色

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Settings">
          <AppWindow className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-[94%] p-0 overflow-hidden rounded-2xl">
        <div className="flex">
          {/* 左侧侧边栏 */}
          <aside className="w-56 bg-white/60 dark:bg-[#0B0B0C] border-r dark:border-r-white/5 p-4">
            <div className="flex items-center justify-between mb-4">
              <DialogHeader className="p-0">
                <DialogTitle className="text-lg">设置</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  管理外观、语言与隐私
                </DialogDescription>
              </DialogHeader>

              <DialogClose asChild>
                <button className="rounded-md p-1 hover:bg-slate-100 dark:hover:bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
            </div>

            <nav className="flex flex-col gap-1">
              {SIDEBAR.map((s) => {
                const Icon = s.icon;
                const active = panel === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setPanel(s.key as PanelKey)}
                    className={cn(
                      "flex items-center gap-3 w-full text-left rounded-md px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5",
                      active ? "bg-slate-100 dark:bg-white/5 font-medium" : "text-muted-foreground"
                    )}
                    aria-pressed={active}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* 内容区 */}
          <main className="flex-1 bg-white dark:bg-[#0B0B0C] p-6">
            <ScrollArea className="h-[70vh]">
              {/* General panel */}
              {panel === "general" && (
                <section className="space-y-6">
                  <h3 className="text-base font-semibold">常规</h3>

                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-[#0F0F10] dark:border-white/5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-medium">保护你的账户</div>
                        <p className="text-sm text-muted-foreground mt-1">
                          添加多因素身份验证 (MFA)（如密钥或短信验证），为登录过程提供额外保护。
                        </p>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">设置 MFA</Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">外观</div>
                        <p className="text-xs text-muted-foreground">深色 / 浅色 / 跟随系统</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">重点色</div>
                        <p className="text-xs text-muted-foreground">选择应用的主色调</p>
                      </div>

                      <div>
                        <RadioGroup onValueChange={(v) => setAccent(v)} value={accent} className="flex gap-2">
                          <label className="flex items-center gap-2">
                            <RadioGroupItem value="default" />
                            <span>默认</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <RadioGroupItem value="blue" />
                            <span>蓝色</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <RadioGroupItem value="violet" />
                            <span>紫色</span>
                          </label>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">语言</div>
                        <p className="text-xs text-muted-foreground">界面与翻译优先语言</p>
                      </div>
                      <div className="w-48">
                        <LanguageSwitcher />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Appearance */}
              {panel === "appearance" && (
                <section className="space-y-6">
                  <h3 className="text-base font-semibold">外观</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">主题</div>
                        <p className="text-xs text-muted-foreground">浅色 / 深色 / 跟随系统</p>
                      </div>
                      <ThemeSwitcher />
                    </div>

                    <Separator />

                    <div>
                      <div className="text-sm font-medium mb-2">侧边栏密度</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">默认</Button>
                        <Button size="sm" variant="ghost">紧凑</Button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Language */}
              {panel === "language" && (
                <section className="space-y-6">
                  <h3 className="text-base font-semibold">语言</h3>
                  <div>
                    <div className="text-sm font-medium">界面语言</div>
                    <div className="mt-2 w-72">
                      <LanguageSwitcher />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">为了获得最佳结果，请选择你的主要语言。</p>
                  </div>
                </section>
              )}

              {/* Security */}
              {panel === "security" && (
                <section className="space-y-6">
                  <h3 className="text-base font-semibold">安全</h3>
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-[#0F0F10]">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-medium">登录与安全</div>
                        <p className="text-sm text-muted-foreground mt-1">管理 OAuth、MFA 与设备会话。</p>
                      </div>
                      <div>
                        <Button variant="ghost" size="sm">打开安全中心</Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="text-sm font-medium">会话管理</div>
                    <p className="text-xs text-muted-foreground mt-1">查看并登出其他设备的会话。</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm">查看会话</Button>
                      <Button size="sm" variant="secondary">登出其他设备</Button>
                    </div>
                  </div>
                </section>
              )}

              {/* About */}
              {panel === "about" && (
                <section className="space-y-6">
                  <h3 className="text-base font-semibold">关于</h3>
                  <div>
                    <div className="text-sm font-medium">Poixe Translate</div>
                    <p className="text-xs text-muted-foreground">版本 0.1.0 • © {new Date().getFullYear()}</p>
                  </div>

                  <Separator />

                  <div>
                    <Button asChild size="sm">
                      <a href="https://github.com/your/repo" target="_blank" rel="noreferrer">在 GitHub 查看仓库</a>
                    </Button>
                  </div>
                </section>
              )}
            </ScrollArea>

            {/* Footer 操作按钮 */}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>取消</Button>
              <Button onClick={() => setOpen(false)}>保存</Button>
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}